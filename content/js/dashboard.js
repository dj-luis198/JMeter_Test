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

    var data = {"OkPercent": 97.40932642487047, "KoPercent": 2.5906735751295336};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.727735368956743, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41ebd76e-b715-4b0d-ae93-7ebabd36a8f6"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c7c889e2-7294-4c5b-9b48-a75115821f34"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6094db8a-60d9-4c01-9525-62b101feb51e"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1796b9af-bd95-4ac7-83f8-8457dcde2ca8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/05271195-a2b8-4eec-a0b8-dc7118b4eb43"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f5f16d7f-1fd2-44dc-b94e-5627bab7f3c6"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eaf8e146-c2c4-4278-84ac-c9667c7d54e2"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93e12e18-301e-486f-b531-bf82aebf14de"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.06666666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e9619c27-6f2d-4356-b133-d6d1bccc4d2b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=730d9d0f-9425-443a-9c89-ae097847bf54"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/13d98463-2e17-4294-80b6-7cc2df1a1555"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/93e12e18-301e-486f-b531-bf82aebf14de"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2982456140350877, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6094db8a-60d9-4c01-9525-62b101feb51e"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/17221e28-3569-4158-926b-c1bd2932dae7"], "isController": false}, {"data": [0.26229508196721313, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5f16d7f-1fd2-44dc-b94e-5627bab7f3c6"], "isController": false}, {"data": [0.41228070175438597, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9078212290502793, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/41ebd76e-b715-4b0d-ae93-7ebabd36a8f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=05271195-a2b8-4eec-a0b8-dc7118b4eb43"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17221e28-3569-4158-926b-c1bd2932dae7"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7c889e2-7294-4c5b-9b48-a75115821f34"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/422c8851-9c76-41e1-addf-2cea25a9ab82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e9619c27-6f2d-4356-b133-d6d1bccc4d2b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13d98463-2e17-4294-80b6-7cc2df1a1555"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/070629dc-59c9-4a38-b713-e594a3ce902c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/730d9d0f-9425-443a-9c89-ae097847bf54"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eaf8e146-c2c4-4278-84ac-c9667c7d54e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1351, 35, 2.5906735751295336, 463.4293116210213, 125, 4458, 146.0, 1266.8, 1540.799999999999, 2522.960000000002, 5.330818523311973, 749.3058226356084, 3.907070763804492], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41ebd76e-b715-4b0d-ae93-7ebabd36a8f6", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 0.6569602272727272, 2.5071022727272725], "isController": false}, {"data": ["see books", 57, 0, 0.0, 2167.0877192982457, 1580, 5001, 2061.0, 2675.4000000000005, 3029.499999999999, 5001.0, 0.25469965548520285, 306.4895279901516, 1.252356216179684], "isController": true}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 545.5999999999999, 136, 1527, 525.0, 1264.8000000000002, 1527.0, 1527.0, 0.08935326109618581, 0.018865405321284542, 0.05959210980920101], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 545.5999999999999, 136, 1527, 525.0, 1264.8000000000002, 1527.0, 1527.0, 0.08867606632969761, 0.01872242728562561, 0.059140470278738436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 182.93333333333334, 126, 405, 131.0, 396.6, 405.0, 405.0, 0.10364484366902746, 0.03811107272413198, 0.0585296467438245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 166.0, 127, 395, 132.0, 389.6, 395.0, 395.0, 0.1036376826614157, 0.07701980127474349, 0.052021258679655916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 266.06666666666666, 126, 869, 132.0, 587.0000000000002, 869.0, 869.0, 0.1036412630415256, 2.057670425101914, 0.06043716100670214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 353.53333333333336, 129, 1417, 378.0, 805.6000000000004, 1417.0, 1417.0, 0.1034589785150188, 6.232197781235989, 0.06022982980998034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7c889e2-7294-4c5b-9b48-a75115821f34", 3, 0, 0.0, 570.0, 221, 1062, 427.0, 1062.0, 1062.0, 1062.0, 0.09886959100945852, 0.04473591520284744, 0.06340269996374781], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6094db8a-60d9-4c01-9525-62b101feb51e", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 248.93333333333334, 129, 466, 231.0, 428.8, 466.0, 466.0, 0.08974566079730045, 0.16216737079616367, 0.05799579616367215], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1796b9af-bd95-4ac7-83f8-8457dcde2ca8", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 134.41176470588232, 127, 191, 131.0, 147.79999999999995, 191.0, 191.0, 0.08453631829415656, 0.06282435373227845, 0.042433269143746545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 192.41176470588235, 126, 395, 132.0, 392.6, 395.0, 395.0, 0.08454010184595799, 0.030090215477800764, 0.04779662697426003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 1350.0, 659, 2341, 911.5, 2341.0, 2341.0, 2341.0, 0.06303630102985557, 18.53476550496017, 0.0359503904310895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 2376.375, 1126, 4289, 1448.5, 4289.0, 4289.0, 4289.0, 0.06200444881920278, 55.79171203971385, 0.03530136099765158], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 228.25000000000003, 127, 393, 136.0, 393.0, 393.0, 393.0, 0.06407022096217455, 0.11337425818697293, 0.03547638211479782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 149.4285714285714, 126, 379, 133.0, 257.5, 379.0, 379.0, 0.07242140983793123, 0.05382098914713444, 0.03635215298505533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 170.92857142857144, 125, 396, 133.5, 386.5, 396.0, 396.0, 0.07242103520696898, 0.019378284811239745, 0.041302621641474496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 153.00000000000003, 127, 390, 132.5, 269.0, 390.0, 390.0, 0.07242215911148357, 0.019520035073017056, 0.04257630838389952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 152.64285714285714, 126, 392, 131.5, 275.0, 392.0, 392.0, 0.07242103520696898, 0.019519732145628358, 0.0426463713181663], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 165.125, 130, 389, 131.5, 389.0, 389.0, 389.0, 0.06406303802942095, 0.04760934759803647, 0.03597289733097368], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05271195-a2b8-4eec-a0b8-dc7118b4eb43", 3, 0, 0.0, 350.3333333333333, 217, 599, 235.0, 599.0, 599.0, 599.0, 0.027388255915863278, 0.027468494946866782, 0.01756343234187847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 219.41176470588235, 127, 996, 131.0, 611.9999999999997, 996.0, 996.0, 0.08437687676508981, 4.487431606647409, 0.049177837296564865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 778.9545454545454, 128, 1823, 394.5, 1514.9, 1777.0999999999995, 1823.0, 0.10637114827654563, 43.52152300820025, 0.058379477862713525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 161.05882352941174, 126, 628, 131.0, 247.19999999999965, 628.0, 628.0, 0.0845405222615087, 1.4836647974508548, 0.0493557748014541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 558.5454545454545, 126, 1183, 259.5, 1175.3, 1182.25, 1183.0, 0.10637783472752768, 14.233191848798414, 0.058487032179295004], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 423.2142857142857, 142, 795, 464.0, 702.5, 795.0, 795.0, 0.0872502461703374, 0.017899202984581634, 0.05882210025364893], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f5f16d7f-1fd2-44dc-b94e-5627bab7f3c6", 3, 0, 0.0, 340.3333333333333, 235, 454, 332.0, 454.0, 454.0, 454.0, 0.024567006510256728, 0.024638980162142245, 0.015754232690496663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 324.7857142857143, 259, 775, 269.5, 650.0, 775.0, 775.0, 0.0723701214784182, 0.11215955350219696, 0.1627620993796847], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eaf8e146-c2c4-4278-84ac-c9667c7d54e2", 3, 0, 0.0, 410.0, 322, 580, 328.0, 580.0, 580.0, 580.0, 0.02203096084363893, 0.030371458064066034, 0.0141279273639221], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 671.1363636363637, 158, 1787, 550.5, 1321.0, 1723.849999999999, 1787.0, 0.10618785597065353, 0.06522672012259871, 0.048012673158606044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 131.54545454545453, 128, 135, 132.0, 134.0, 134.85, 135.0, 0.10650606842530778, 0.0791514824918547, 0.053461053877547064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 201.72727272727275, 126, 405, 132.0, 399.8, 404.85, 405.0, 0.10651070916766722, 0.10121543243347922, 0.056678372758433716], "isController": false}, {"data": ["login", 22, 0, 0.0, 3663.0454545454545, 1920, 9443, 3055.0, 8147.499999999999, 9293.899999999998, 9443.0, 0.10339074652818572, 45.116678072937475, 0.2183376853396621], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 141.1764705882353, 128, 174, 137.0, 166.0, 174.0, 174.0, 0.08055306788728256, 0.06521337234234106, 0.028634098350557476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 912.1363636363637, 260, 1958, 528.0, 1649.3, 1912.0999999999995, 1958.0, 0.10630176171010543, 57.89616356338001, 0.22671228884604605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93e12e18-301e-486f-b531-bf82aebf14de", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 557.8, 261, 1545, 520.0, 1092.0000000000002, 1545.0, 1545.0, 0.1033620220367831, 8.393305737109033, 0.23070053395097884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, 46.666666666666664, 1417.0666666666666, 129, 4420, 1275.0, 4379.8, 4420.0, 4420.0, 0.10106999434008032, 64.50054104031345, 0.15268412426218902], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e9619c27-6f2d-4356-b133-d6d1bccc4d2b", 3, 0, 0.0, 436.6666666666667, 414, 466, 430.0, 466.0, 466.0, 466.0, 0.030572936836312497, 0.02548739949147015, 0.0196056919165155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=730d9d0f-9425-443a-9c89-ae097847bf54", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.31148976293103453, 1.1887122844827587], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1365.7391304347825, 305, 3022, 1299.0, 2356.0, 2889.199999999998, 3022.0, 0.09842182739379, 0.030706674069699774, 0.04440516040618261], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/13d98463-2e17-4294-80b6-7cc2df1a1555", 3, 0, 0.0, 392.0, 223, 593, 360.0, 593.0, 593.0, 593.0, 0.019222882919827763, 0.02650029595230162, 0.012327174268248925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 154.66666666666669, 131, 405, 136.0, 252.00000000000009, 405.0, 405.0, 0.06906045552276463, 0.05361627162167762, 0.02454883379910774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 402.5882352941177, 259, 1125, 274.0, 740.1999999999997, 1125.0, 1125.0, 0.08431954130169532, 6.056843925769043, 0.18836756903042448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93e12e18-301e-486f-b531-bf82aebf14de", 3, 0, 0.0, 574.3333333333334, 404, 860, 459.0, 860.0, 860.0, 860.0, 0.024877684716809022, 0.024950568558752797, 0.01595346318102662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 403.05882352941177, 262, 531, 515.0, 529.4, 531.0, 531.0, 0.1122149245849698, 0.17391121612924518, 0.25237399542889205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 153.45454545454547, 128, 380, 131.0, 331.4000000000002, 380.0, 380.0, 0.09192405401791683, 0.06831465342542452, 0.04614156617696216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 176.54545454545456, 125, 392, 132.0, 390.4, 392.0, 392.0, 0.09192021325489476, 0.024595838312344884, 0.052423246621932165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 151.8181818181818, 126, 378, 130.0, 328.8000000000002, 378.0, 378.0, 0.09192482220903704, 0.024776612236029515, 0.05404174118148467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 176.8181818181818, 126, 394, 132.0, 390.2, 394.0, 394.0, 0.09192174952158907, 0.024775784050740806, 0.05412970211085763], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 154.33333333333334, 142, 179, 142.0, 179.0, 179.0, 179.0, 0.046267022408661186, 0.013645156999429375, 0.028600610531916537], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1512.0350877192982, 1010, 4458, 1384.0, 2123.0000000000005, 2484.1999999999994, 4458.0, 0.2414773329040403, 288.89084125724963, 0.47682340540231394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1365.7391304347825, 305, 3022, 1299.0, 2356.0, 2889.199999999998, 3022.0, 0.09714273646865035, 0.030307609866323148, 0.04382807055519186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 171.71428571428572, 128, 398, 134.0, 398.0, 398.0, 398.0, 0.05417160015168048, 0.01460093910338263, 0.03189987782369466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 168.57142857142858, 127, 392, 133.0, 392.0, 392.0, 392.0, 0.0541682465738584, 0.014600035209360273, 0.03184500433345973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6094db8a-60d9-4c01-9525-62b101feb51e", 3, 0, 0.0, 393.3333333333333, 233, 484, 463.0, 484.0, 484.0, 484.0, 0.04071053452931837, 0.026172951072722585, 0.026106690437095438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 302.8666666666667, 126, 1566, 130.0, 1245.6000000000001, 1566.0, 1566.0, 0.06921916170980558, 8.320638947661084, 0.03990016001162882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 266.2, 127, 1046, 131.0, 868.4000000000001, 1046.0, 1046.0, 0.06921500950552797, 2.729702986858377, 0.039965359329721846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 131.66666666666663, 127, 143, 131.0, 138.2, 143.0, 143.0, 0.06950365125847945, 0.05165261582783482, 0.03488757494810394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 131.85714285714286, 127, 138, 131.0, 138.0, 138.0, 138.0, 0.05417034251133708, 0.014494798679791365, 0.030894023463496924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 183.2, 127, 402, 131.0, 397.2, 402.0, 402.0, 0.06942130400977452, 0.03247796162853123, 0.03881446346588174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 132.85714285714286, 130, 137, 132.0, 137.0, 137.0, 137.0, 0.05417118093174431, 0.04025807489165764, 0.02719139355362947], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 449.7857142857142, 129, 860, 458.5, 729.5, 860.0, 860.0, 0.08637549897274853, 0.0172136440126355, 0.058774622801280825], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 175.57142857142858, 134, 393, 140.0, 393.0, 393.0, 393.0, 0.05348819439138076, 0.042101059257278216, 0.01901338160006113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1784.5, 1035, 3807, 1582.5, 3076.7, 3719.0999999999985, 3807.0, 0.10582570506375999, 0.0547730700037039, 0.048675690512725536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 306.7142857142857, 264, 528, 269.0, 528.0, 528.0, 528.0, 0.05411380907102051, 0.08386583495674761, 0.12170322489312523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17221e28-3569-4158-926b-c1bd2932dae7", 3, 0, 0.0, 596.0, 236, 1010, 542.0, 1010.0, 1010.0, 1010.0, 0.022560462038262542, 0.026665702363584405, 0.014467483794068103], "isController": false}, {"data": ["addBook", 61, 13, 21.311475409836067, 1271.426229508197, 663, 2728, 1048.0, 2172.8, 2566.5, 2728.0, 0.29266139556306137, 81.5227798739517, 1.065170535234513], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 230.15789473684217, 127, 789, 134.0, 525.4, 549.3, 789.0, 0.24282391432149886, 0.18045800663931702, 0.11738070077064643], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 858.3508771929827, 624, 2313, 779.0, 1058.2000000000003, 1146.1, 2313.0, 0.242891171971211, 71.41806930548039, 0.12215718121598991], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 198.63157894736844, 128, 526, 134.0, 386.20000000000005, 399.0, 526.0, 0.24327784891165172, 0.4304877560819462, 0.11831286011523687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5f16d7f-1fd2-44dc-b94e-5627bab7f3c6", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1279.4912280701756, 878, 4327, 1178.0, 1639.2000000000003, 1830.1999999999991, 4327.0, 0.2423160311184798, 218.03639074655658, 0.12163128905751817], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 157.7058823529412, 133, 387, 137.0, 235.79999999999987, 387.0, 387.0, 0.11328650824325945, 0.08463298711532566, 0.04026981347709613], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 13, 7.262569832402234, 203.2011173184357, 127, 1787, 140.0, 322.0, 403.0, 1351.7999999999938, 0.732229126356567, 1.5843419167426849, 0.35172932245284483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 135.81818181818184, 129, 148, 135.0, 146.4, 148.0, 148.0, 0.08763334209666754, 0.06786449246353259, 0.031150914573424792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41ebd76e-b715-4b0d-ae93-7ebabd36a8f6", 3, 0, 0.0, 349.0, 231, 506, 310.0, 506.0, 506.0, 506.0, 0.07724393635099644, 0.03495086963798342, 0.04953468574591895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 138.53333333333333, 129, 176, 136.0, 156.8, 176.0, 176.0, 0.10010945300194879, 0.08124116742638618, 0.03558578212178649], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=05271195-a2b8-4eec-a0b8-dc7118b4eb43", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17221e28-3569-4158-926b-c1bd2932dae7", 1, 0, 0.0, 610.0, 610, 610, 610.0, 610.0, 610.0, 610.0, 1.639344262295082, 0.2961705942622951, 1.130251024590164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 354.8181818181818, 257, 759, 264.0, 711.8000000000002, 759.0, 759.0, 0.09182123240788662, 0.14230497639776957, 0.20650810374547154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 489.06666666666666, 259, 1700, 267.0, 1385.6000000000001, 1700.0, 1700.0, 0.06916841124770592, 11.12616674861202, 0.15320172650118508], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7c889e2-7294-4c5b-9b48-a75115821f34", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 0.8287342316513762, 3.162629013761468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/422c8851-9c76-41e1-addf-2cea25a9ab82", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.5712628577817531, 1.067405523255814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 175.92857142857142, 134, 401, 136.5, 400.0, 401.0, 401.0, 0.07052541433680923, 0.05847273122260844, 0.025069580877537658], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e9619c27-6f2d-4356-b133-d6d1bccc4d2b", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 172.45454545454544, 131, 412, 136.0, 399.4, 410.2, 412.0, 0.10537710634465978, 0.08181132767969192, 0.03745826827095328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13d98463-2e17-4294-80b6-7cc2df1a1555", 1, 0, 0.0, 795.0, 795, 795, 795.0, 795.0, 795.0, 795.0, 1.2578616352201257, 0.22725039308176098, 0.8672366352201257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/070629dc-59c9-4a38-b713-e594a3ce902c", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/730d9d0f-9425-443a-9c89-ae097847bf54", 3, 0, 0.0, 352.3333333333333, 287, 446, 324.0, 446.0, 446.0, 446.0, 0.021731571627260082, 0.02568598195917362, 0.013935936232324989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eaf8e146-c2c4-4278-84ac-c9667c7d54e2", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 131.94117647058823, 126, 146, 131.0, 138.0, 146.0, 146.0, 0.1124985937675779, 0.08360491196985037, 0.05646902069974125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 193.1764705882353, 127, 397, 132.0, 395.4, 397.0, 397.0, 0.11250231622415754, 0.030103158833417156, 0.06416147722158985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 236.70588235294113, 127, 397, 140.0, 394.6, 397.0, 397.0, 0.1123120424935916, 0.03027160520335086, 0.06602719685658413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 191.41176470588232, 125, 393, 132.0, 385.8, 393.0, 393.0, 0.11250082721196479, 0.030322488584474883, 0.06624804571173316], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 22.857142857142858, 0.5921539600296077], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.428571428571429, 0.29607698001480387], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.571428571428571, 0.22205773501110287], "isController": false}, {"data": ["401/Unauthorized", 20, 57.142857142857146, 1.4803849000740192], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1351, 35, "401/Unauthorized", 20, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
