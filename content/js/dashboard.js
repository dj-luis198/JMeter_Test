/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 97.79467680608364, "KoPercent": 2.20532319391635};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7775603392041748, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.12280701754385964, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5af300d3-a839-42ce-a4b8-85386ae12fd3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ce39e36e-ee88-47ec-b76a-058a7bad9156"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0824438d-9d93-4c79-a220-e72d1f8ce4fb"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb5c6c1a-002b-4ced-a2c7-7efe7c8c7f7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4b86235-3fba-401a-aa19-0df787e66943"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b9aadac6-5714-4fa2-97b6-4351a442483a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/72db2a28-2213-4c20-a3c6-5e2fc6197961"], "isController": false}, {"data": [0.8695652173913043, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c467c889-a44e-4782-9f9f-48803a1c26a4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f3c400ca-ec94-47d3-9ead-14899ab32e0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58afdbb1-1a1c-4357-a8fe-6470c31b1936"], "isController": false}, {"data": [0.6578947368421053, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6e0d6af4-f29a-46ad-8921-d595a7c6d262"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/835b31ea-4f80-4a13-b98a-d129679a0315"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bb280310-bfe6-4434-b225-7caeab3edd2d"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3958333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c4b86235-3fba-401a-aa19-0df787e66943"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.39473684210526316, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3958333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0824438d-9d93-4c79-a220-e72d1f8ce4fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.43478260869565216, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ac3854d-1896-44b7-aa9f-a985fd02a9e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9aadac6-5714-4fa2-97b6-4351a442483a"], "isController": false}, {"data": [0.30357142857142855, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c467c889-a44e-4782-9f9f-48803a1c26a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5af300d3-a839-42ce-a4b8-85386ae12fd3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.43859649122807015, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9289940828402367, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb280310-bfe6-4434-b225-7caeab3edd2d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3c400ca-ec94-47d3-9ead-14899ab32e0a"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=835b31ea-4f80-4a13-b98a-d129679a0315"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8ac3854d-1896-44b7-aa9f-a985fd02a9e8"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/58afdbb1-1a1c-4357-a8fe-6470c31b1936"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9893d0c4-309e-457f-bf3d-ec07f4c6e4f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72db2a28-2213-4c20-a3c6-5e2fc6197961"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e0d6af4-f29a-46ad-8921-d595a7c6d262"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1315, 29, 2.20532319391635, 368.3992395437261, 107, 2848, 124.0, 914.4000000000005, 1120.4000000000008, 2172.6799999999976, 5.188195375996212, 758.5868686750374, 3.7950006287974434], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1852.0526315789473, 1330, 3845, 1784.0, 2703.2000000000003, 3072.2999999999997, 3845.0, 0.2525095909344627, 303.8540080983037, 1.2415876858935737], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5af300d3-a839-42ce-a4b8-85386ae12fd3", 3, 0, 0.0, 309.6666666666667, 233, 463, 233.0, 463.0, 463.0, 463.0, 0.024232046073196935, 0.02864145810279234, 0.015539430587304023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce39e36e-ee88-47ec-b76a-058a7bad9156", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 1.4515269886363635, 2.712180397727273], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 530.9285714285714, 119, 1191, 500.5, 1023.0, 1191.0, 1191.0, 0.10218903511653199, 0.02012987131480792, 0.06875805194852593], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 530.9285714285714, 119, 1191, 500.5, 1023.0, 1191.0, 1191.0, 0.097988437364391, 0.019302409815641755, 0.06593167318756386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 193.94117647058823, 108, 397, 113.0, 355.4, 397.0, 397.0, 0.08378346410124986, 0.02982090668493475, 0.047368844995662976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 111.88235294117646, 109, 116, 112.0, 116.0, 116.0, 116.0, 0.08378181244702032, 0.06226363210174069, 0.04205454257594575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 204.82352941176472, 108, 830, 113.0, 429.99999999999966, 830.0, 830.0, 0.08378387702498237, 1.4703858647974648, 0.04891403620202757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 266.3529411764706, 108, 2078, 111.0, 691.5999999999988, 2078.0, 2078.0, 0.0837813995436378, 4.455762227464036, 0.0488307720455968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0824438d-9d93-4c79-a220-e72d1f8ce4fb", 3, 0, 0.0, 370.6666666666667, 229, 603, 280.0, 603.0, 603.0, 603.0, 0.033224063081421104, 0.027697534359218567, 0.02130579566093736], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 223.37500000000003, 109, 384, 218.0, 332.20000000000005, 384.0, 384.0, 0.08918219923303308, 0.1500703877474806, 0.05763856858389816], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fb5c6c1a-002b-4ced-a2c7-7efe7c8c7f7b", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.27734375, 2.38671875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 124.26315789473684, 110, 336, 113.0, 116.0, 336.0, 336.0, 0.10726221660193298, 0.07971342464264745, 0.05384060481776714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 146.31578947368422, 109, 335, 111.0, 332.0, 335.0, 335.0, 0.10726463880044261, 0.037180958268409996, 0.060700229913285005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 740.125, 539, 967, 788.5, 967.0, 967.0, 967.0, 0.07758553805570642, 22.812724270695945, 0.044248002172395065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1029.875, 755, 1134, 1095.5, 1134.0, 1134.0, 1134.0, 0.07714561234329798, 69.41575759402122, 0.043921769527483126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 167.0, 108, 346, 111.0, 346.0, 346.0, 346.0, 0.07773631840796019, 0.1375568446828358, 0.043043449743470144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4b86235-3fba-401a-aa19-0df787e66943", 1, 0, 0.0, 853.0, 853, 853, 853.0, 853.0, 853.0, 853.0, 1.1723329425556857, 0.21179843200468934, 0.8082686107854631], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9aadac6-5714-4fa2-97b6-4351a442483a", 3, 0, 0.0, 321.6666666666667, 207, 440, 318.0, 440.0, 440.0, 440.0, 0.06698970591519103, 0.0303110974030324, 0.042958893441707786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 113.72727272727273, 109, 123, 113.0, 121.80000000000001, 123.0, 123.0, 0.10625144888339386, 0.07896225839869407, 0.05333324680279731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 172.81818181818184, 109, 337, 114.0, 336.2, 337.0, 337.0, 0.10625555426760945, 0.04293992214365751, 0.05978761567366021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 242.81818181818178, 109, 869, 116.0, 763.6000000000004, 869.0, 869.0, 0.10602614026294484, 8.698934633077263, 0.06150344464471604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 233.63636363636365, 109, 776, 115.0, 688.8000000000003, 776.0, 776.0, 0.1060189870367693, 2.8598960592260614, 0.061602829381716545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 138.375, 109, 332, 111.0, 332.0, 332.0, 332.0, 0.07791423590482777, 0.05790306008161516, 0.04375066957546481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 158.31578947368425, 108, 790, 111.0, 325.0, 790.0, 790.0, 0.10726282214130466, 5.107140431380021, 0.06257365498066447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 620.2105263157894, 108, 1312, 760.0, 1107.0, 1312.0, 1312.0, 0.08957362952346828, 42.43170415892719, 0.048608058208715985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 169.52631578947367, 109, 752, 112.0, 337.0, 752.0, 752.0, 0.1072634276875134, 1.6873370760271886, 0.06267875767780325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 478.2631578947369, 108, 953, 545.0, 886.0, 953.0, 953.0, 0.08966578259351198, 13.887614854788625, 0.04874563026786473], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 597.2857142857143, 112, 2258, 478.5, 1683.0, 2258.0, 2258.0, 0.09820564261563715, 0.019345196341138345, 0.06670804602337295], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 378.63636363636357, 223, 983, 235.0, 877.8000000000004, 983.0, 983.0, 0.10590364693649633, 11.667170862296377, 0.23571647126641507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72db2a28-2213-4c20-a3c6-5e2fc6197961", 3, 0, 0.0, 297.6666666666667, 204, 474, 215.0, 474.0, 474.0, 474.0, 0.09080727668977208, 0.041087927929291404, 0.058232530950146806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 417.13043478260875, 128, 880, 417.0, 789.0000000000003, 878.6, 880.0, 0.10739884662977749, 0.06597058059583012, 0.048560220692956034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 150.21052631578942, 110, 370, 113.0, 345.0, 370.0, 370.0, 0.08966155123921701, 0.06663324266898843, 0.04500589583687261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 194.84210526315786, 109, 337, 117.0, 336.0, 337.0, 337.0, 0.08966451314528955, 0.09487220742233402, 0.04717341470781167], "isController": false}, {"data": ["login", 23, 0, 0.0, 2213.9130434782605, 1254, 3988, 2407.0, 3372.8, 3870.3999999999983, 3988.0, 0.11066470998628719, 46.19820297651983, 0.23079737983255946], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 138.94736842105266, 112, 339, 115.0, 332.0, 339.0, 339.0, 0.10444610580940235, 0.08455646651952592, 0.03712732667443599], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c467c889-a44e-4782-9f9f-48803a1c26a4", 3, 0, 0.0, 317.3333333333333, 216, 422, 314.0, 422.0, 422.0, 422.0, 0.04486652209676213, 0.02843591097734241, 0.028771825693561657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3c400ca-ec94-47d3-9ead-14899ab32e0a", 3, 0, 0.0, 350.3333333333333, 226, 545, 280.0, 545.0, 545.0, 545.0, 0.02752722901736968, 0.027607875196131507, 0.017652552462310636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58afdbb1-1a1c-4357-a8fe-6470c31b1936", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 778.8947368421054, 223, 1430, 876.0, 1219.0, 1430.0, 1430.0, 0.08952382747344911, 56.43499535742388, 0.18928565433672268], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e0d6af4-f29a-46ad-8921-d595a7c6d262", 3, 0, 0.0, 866.6666666666666, 263, 1803, 534.0, 1803.0, 1803.0, 1803.0, 0.02076541312789418, 0.024544015321413985, 0.013316361934229014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/835b31ea-4f80-4a13-b98a-d129679a0315", 3, 0, 0.0, 287.3333333333333, 203, 428, 231.0, 428.0, 428.0, 428.0, 0.02344262807489138, 0.02351130764932954, 0.015033195738130216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb280310-bfe6-4434-b225-7caeab3edd2d", 3, 0, 0.0, 294.6666666666667, 209, 440, 235.0, 440.0, 440.0, 440.0, 0.032265697261717824, 0.026898584208092238, 0.020691218621609414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 458.235294117647, 224, 2189, 437.0, 807.3999999999987, 2189.0, 2189.0, 0.08373394278508946, 6.014779194824257, 0.1870593578222279], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, 38.46153846153846, 762.7692307692308, 109, 1467, 988.0, 1366.1999999999998, 1467.0, 1467.0, 0.1083577138189426, 79.78561126774358, 0.1778313532003034], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 687.6666666666667, 163, 1423, 639.0, 1275.5, 1387.25, 1423.0, 0.10434102123774536, 0.03260656913679543, 0.0470757341912484], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c4b86235-3fba-401a-aa19-0df787e66943", 3, 0, 0.0, 753.6666666666666, 310, 1249, 702.0, 1249.0, 1249.0, 1249.0, 0.018526409396594848, 0.02189758871062366, 0.01188054248414448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 320.7894736842105, 222, 904, 228.0, 668.0, 904.0, 904.0, 0.10719443942949991, 6.906956019955092, 0.23963929600051906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 130.72222222222223, 112, 330, 118.5, 150.9000000000003, 330.0, 330.0, 0.08734556818292102, 0.06781223311076388, 0.03104861994002271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 400.2, 222, 1189, 439.0, 765.4000000000003, 1189.0, 1189.0, 0.09938645428885678, 8.070477729980256, 0.22182720132714048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 137.2222222222222, 109, 337, 113.0, 337.0, 337.0, 337.0, 0.05103255877249686, 0.03792556369713877, 0.02561595235260096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 164.88888888888889, 109, 371, 111.0, 371.0, 371.0, 371.0, 0.05103313751729457, 0.013655351249744836, 0.029104836240332055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 160.88888888888889, 110, 339, 112.0, 339.0, 339.0, 339.0, 0.05103284814325488, 0.013754947351111666, 0.030001732990468197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 184.88888888888889, 108, 335, 111.0, 335.0, 335.0, 335.0, 0.05103313751729457, 0.0137550253464583, 0.030051740159109983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 114.5, 112, 117, 114.5, 117.0, 117.0, 117.0, 0.04133854198962403, 0.012191640313346148, 0.02555400105413282], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1256.4912280701749, 867, 2848, 1079.0, 2159.8, 2619.2999999999997, 2848.0, 0.2571993249645787, 307.6998096104558, 0.5078681983187286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 687.6666666666667, 163, 1423, 639.0, 1275.5, 1387.25, 1423.0, 0.10193983001533345, 0.0318561968797917, 0.045992384245199275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 157.2, 111, 331, 115.0, 331.0, 331.0, 331.0, 0.040501899539088386, 0.010916527610144916, 0.023850239669990524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 155.0, 109, 330, 111.0, 330.0, 330.0, 330.0, 0.04043083093443736, 0.01089737240029757, 0.023768906467315717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 198.1666666666667, 108, 1103, 112.5, 520.700000000001, 1103.0, 1103.0, 0.08501754667699472, 4.271582833363246, 0.04957511890648542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 180.44444444444443, 108, 560, 112.5, 458.3000000000002, 560.0, 560.0, 0.08501393283899306, 1.4103586377698012, 0.0496560330373589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0824438d-9d93-4c79-a220-e72d1f8ce4fb", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.3016094532554257, 1.1510068864774625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 126.00000000000003, 108, 330, 113.0, 145.50000000000028, 330.0, 330.0, 0.08501834979383051, 0.06318258221982911, 0.04267522636135633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 200.6, 110, 331, 122.0, 331.0, 331.0, 331.0, 0.04043246565262043, 0.010818843348455075, 0.02305914056751009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 124.83333333333333, 108, 338, 111.5, 144.5000000000003, 338.0, 338.0, 0.08501915292583968, 0.029843420107974323, 0.048090803407378716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 115.0, 111, 123, 113.0, 123.0, 123.0, 123.0, 0.04050255571126538, 0.030100043844016558, 0.020330384409756257], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 473.2142857142857, 112, 714, 468.5, 708.0, 714.0, 714.0, 0.09960301085672818, 0.019231384908720957, 0.0677822944976451], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 118.6, 114, 123, 118.0, 123.0, 123.0, 123.0, 0.0379293603592669, 0.029854555126532345, 0.013482702315208156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1113.0, 778, 2801, 912.0, 2184.0000000000014, 2761.9999999999995, 2801.0, 0.11022452256008435, 0.05704980171566866, 0.050698974732226294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 318.0, 224, 447, 246.0, 447.0, 447.0, 447.0, 0.040394247859104865, 0.06260319468007755, 0.09084761017531104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ac3854d-1896-44b7-aa9f-a985fd02a9e8", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9aadac6-5714-4fa2-97b6-4351a442483a", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 0.8603050595238095, 3.283110119047619], "isController": false}, {"data": ["addBook", 56, 12, 21.428571428571427, 1014.3035714285716, 567, 2617, 892.0, 1639.3000000000002, 1739.6499999999999, 2617.0, 0.26129762265823675, 84.81584404818841, 0.947787135758113], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c467c889-a44e-4782-9f9f-48803a1c26a4", 1, 0, 0.0, 1108.0, 1108, 1108, 1108.0, 1108.0, 1108.0, 1108.0, 0.9025270758122744, 0.16305420803249096, 0.6222501128158844], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5af300d3-a839-42ce-a4b8-85386ae12fd3", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 185.52631578947367, 110, 493, 115.0, 448.2, 455.1, 493.0, 0.25822234302799674, 0.1919015654729546, 0.12482427714732264], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 683.2456140350878, 538, 1312, 563.0, 978.0, 985.3, 1312.0, 0.25814048276799056, 75.90187300450613, 0.12982651232960463], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 174.6842105263158, 107, 450, 114.0, 339.0, 431.19999999999993, 450.0, 0.25865354945274355, 0.4576955386800501, 0.12579049572994755], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1058.2105263157894, 753, 2729, 881.0, 2046.6000000000001, 2350.999999999999, 2729.0, 0.2577599305404819, 231.9328385939535, 0.12938340263457782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 117.2, 111, 127, 116.0, 127.0, 127.0, 127.0, 0.10233738589381472, 0.07645322286012525, 0.03637774264194195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 12, 7.100591715976331, 156.85798816568038, 110, 434, 116.0, 274.0, 327.5, 428.4000000000001, 0.7258358923701334, 1.672606808469517, 0.3451847606674254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 142.0, 111, 346, 116.0, 346.0, 346.0, 346.0, 0.050622658702035035, 0.039202898779993924, 0.017994773210489014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 114.76470588235294, 110, 126, 113.0, 122.8, 126.0, 126.0, 0.08353931507589792, 0.06779411213678825, 0.029695615905885587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb280310-bfe6-4434-b225-7caeab3edd2d", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3c400ca-ec94-47d3-9ead-14899ab32e0a", 1, 0, 0.0, 2258.0, 2258, 2258, 2258.0, 2258.0, 2258.0, 2258.0, 0.4428697962798937, 0.08001065655447298, 0.3053379650132861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 353.1111111111111, 224, 668, 231.0, 668.0, 668.0, 668.0, 0.050999881000277664, 0.07903985463617251, 0.11469992767933541], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=835b31ea-4f80-4a13-b98a-d129679a0315", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ac3854d-1896-44b7-aa9f-a985fd02a9e8", 3, 0, 0.0, 386.3333333333333, 220, 633, 306.0, 633.0, 633.0, 633.0, 0.04309168474123443, 0.027703801225240236, 0.027633665019606717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 340.44444444444446, 222, 1219, 234.5, 715.0000000000008, 1219.0, 1219.0, 0.08496858522585123, 5.771700438237279, 0.18988856134023782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58afdbb1-1a1c-4357-a8fe-6470c31b1936", 3, 0, 0.0, 467.6666666666667, 305, 714, 384.0, 714.0, 714.0, 714.0, 0.02684155430493795, 0.0269201916710657, 0.017212845696851487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 137.63636363636365, 112, 336, 116.0, 295.40000000000015, 336.0, 336.0, 0.10984621529858199, 0.09107366873876573, 0.03904689684441782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9893d0c4-309e-457f-bf3d-ec07f4c6e4f9", 2, 0, 0.0, 234.5, 201, 268, 234.5, 268.0, 268.0, 268.0, 0.06444752360390552, 0.03961886338736184, 0.04005942263074791], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 126.52631578947368, 110, 345, 114.0, 120.0, 345.0, 345.0, 0.09254568834508826, 0.07184943577572771, 0.03289710015391809], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72db2a28-2213-4c20-a3c6-5e2fc6197961", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 0.7820955086580086, 2.9846455627705626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e0d6af4-f29a-46ad-8921-d595a7c6d262", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 113.0, 109, 122, 112.0, 118.4, 122.0, 122.0, 0.09946224081797747, 0.07391676295164146, 0.04992538259808634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 185.8, 107, 343, 111.0, 342.4, 343.0, 343.0, 0.09946553850642548, 0.0365743073883002, 0.05616953652374573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 268.6, 110, 1076, 114.0, 651.2000000000003, 1076.0, 1076.0, 0.09946421940480611, 5.991560098353536, 0.05790423502068856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 203.39999999999998, 108, 1019, 111.0, 629.6000000000003, 1019.0, 1019.0, 0.09946158130652732, 1.9746879600098133, 0.05799982967204201], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 27.586206896551722, 0.6083650190114068], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.344827586206897, 0.22813688212927757], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.896551724137931, 0.1520912547528517], "isController": false}, {"data": ["401/Unauthorized", 16, 55.172413793103445, 1.2167300380228137], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1315, 29, "401/Unauthorized", 16, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
