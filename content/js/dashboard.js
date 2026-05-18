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

    var data = {"OkPercent": 96.60159074475777, "KoPercent": 3.398409255242227};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7794571252313387, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1473c30d-ac7c-472e-87a7-0560001ca24f"], "isController": false}, {"data": [0.375, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8882d839-5e3e-4f6b-840e-ae9df07fd611"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ff4d861-9f73-46da-9632-1cbf7bf15a7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/37cd12dd-ffc2-4786-888f-0189507842a4"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6e356a1-c930-4726-8d2a-401317201c95"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4b2ba63b-c047-4fee-a515-a3e50b60b35b"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a0dacfe-caff-4411-9743-9f0cc541dc68"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8c7f32d9-f47a-478c-b5df-d4698c19ac8c"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0290f42-6de1-48e8-bd59-bebcbceb9025"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/89d88ebe-2f33-46dc-83f5-d59fb9579dc8"], "isController": false}, {"data": [0.64, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c72568da-b00a-40ae-9897-b0691b7d2cce"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/092bf3b9-dec9-44ea-962f-d0100a830dd8"], "isController": false}, {"data": [0.04, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3f05f6a9-b289-448f-bb68-e5ca41fb3407"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6a0dacfe-caff-4411-9743-9f0cc541dc68"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b0290f42-6de1-48e8-bd59-bebcbceb9025"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/72b8d2ec-8820-4c05-8802-b6f43d1c511d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c66b8e8-4330-4a38-b614-72bda24c79ba"], "isController": false}, {"data": [0.28846153846153844, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2c66b8e8-4330-4a38-b614-72bda24c79ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/da2292a3-f99e-4518-af75-18227174ddbc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49166666666666664, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.28846153846153844, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1473c30d-ac7c-472e-87a7-0560001ca24f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c7f32d9-f47a-478c-b5df-d4698c19ac8c"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0ff4d861-9f73-46da-9632-1cbf7bf15a7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.4117647058823529, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.38, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b6e356a1-c930-4726-8d2a-401317201c95"], "isController": false}, {"data": [0.2807017543859649, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b2ba63b-c047-4fee-a515-a3e50b60b35b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89d88ebe-2f33-46dc-83f5-d59fb9579dc8"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8882d839-5e3e-4f6b-840e-ae9df07fd611"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8591954022988506, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f05f6a9-b289-448f-bb68-e5ca41fb3407"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c72568da-b00a-40ae-9897-b0691b7d2cce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72b8d2ec-8820-4c05-8802-b6f43d1c511d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1383, 47, 3.398409255242227, 313.8083875632681, 77, 2736, 90.0, 864.4000000000005, 1093.6, 1633.2000000000016, 5.431346290543645, 783.4289785446113, 3.971229395590909], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1473c30d-ac7c-472e-87a7-0560001ca24f", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 1.0565149853801168, 4.0318896198830405], "isController": false}, {"data": ["see books", 60, 0, 0.0, 1320.5333333333335, 956, 1901, 1268.5, 1591.7, 1668.7999999999997, 1901.0, 0.2579524593617396, 310.40457290596345, 1.2683502274280851], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8882d839-5e3e-4f6b-840e-ae9df07fd611", 1, 0, 0.0, 1503.0, 1503, 1503, 1503.0, 1503.0, 1503.0, 1503.0, 0.6653359946773121, 0.12020230372588157, 0.4587179807052562], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ff4d861-9f73-46da-9632-1cbf7bf15a7a", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37cd12dd-ffc2-4786-888f-0189507842a4", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 1.0824947033898307, 2.0226430084745766], "isController": false}, {"data": ["deleteBook", 18, 5, 27.77777777777778, 596.3888888888889, 81, 1593, 496.0, 1556.1000000000001, 1593.0, 1593.0, 0.08626887131560028, 0.018323710460100645, 0.05748917894799904], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, 27.77777777777778, 596.3888888888889, 81, 1593, 496.0, 1556.1000000000001, 1593.0, 1593.0, 0.08751501125540284, 0.018588393503955192, 0.05831960087077436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6e356a1-c930-4726-8d2a-401317201c95", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 98.3529411764706, 78, 239, 80.0, 238.2, 239.0, 239.0, 0.09276083528403914, 0.04121164407667502, 0.05198613907577469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 80.29411764705884, 79, 83, 80.0, 83.0, 83.0, 83.0, 0.09284036917699742, 0.0689956259215772, 0.046601513434547534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 171.2941176470588, 77, 626, 80.0, 614.0, 626.0, 626.0, 0.0928408761994222, 3.233644304758368, 0.05373229708807322], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b2ba63b-c047-4fee-a515-a3e50b60b35b", 3, 0, 0.0, 507.33333333333337, 214, 858, 450.0, 858.0, 858.0, 858.0, 0.021180307961677764, 0.02919876439378429, 0.013582424050945702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 213.29411764705884, 78, 934, 80.0, 882.8, 934.0, 934.0, 0.09284138322738493, 9.850178497799114, 0.053641925120693795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a0dacfe-caff-4411-9743-9f0cc541dc68", 1, 0, 0.0, 723.0, 723, 723, 723.0, 723.0, 723.0, 723.0, 1.3831258644536653, 0.2498811376210235, 0.953600449515906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c7f32d9-f47a-478c-b5df-d4698c19ac8c", 3, 0, 0.0, 520.3333333333334, 268, 888, 405.0, 888.0, 888.0, 888.0, 0.027824925568324103, 0.022616809617221775, 0.017843458128124507], "isController": false}, {"data": ["goToProfile", 18, 5, 27.77777777777778, 223.2222222222222, 79, 888, 184.5, 460.5000000000007, 888.0, 888.0, 0.08615861801576703, 0.12095955720453577, 0.05567682829784077], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0290f42-6de1-48e8-bd59-bebcbceb9025", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 80.45, 78, 85, 80.0, 82.0, 84.85, 85.0, 0.12708579562062347, 0.09444559615946727, 0.06379111225488328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 96.00000000000001, 78, 238, 80.0, 222.1000000000003, 237.95, 238.0, 0.12708660316572729, 0.043549501026224326, 0.07194541392106651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 547.7777777777778, 390, 705, 550.0, 705.0, 705.0, 705.0, 0.08337656562662121, 24.515478656757207, 0.047550697583932405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 793.6666666666666, 698, 905, 786.0, 905.0, 905.0, 905.0, 0.08308101321911233, 74.75644173540081, 0.04730100654955321], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 167.11111111111111, 79, 241, 233.0, 241.0, 241.0, 241.0, 0.0836796742071351, 0.14807379849934452, 0.04633435085492734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 81.83333333333334, 79, 91, 81.0, 88.9, 91.0, 91.0, 0.05443386512195454, 0.04045329234160879, 0.027323248703793587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 81.16666666666666, 78, 88, 80.0, 87.10000000000001, 88.0, 88.0, 0.05443460589345333, 0.014565509780084192, 0.031044736173610102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 92.75, 77, 235, 80.0, 189.10000000000016, 235.0, 235.0, 0.05443485282176668, 0.014671893924616802, 0.03200173964717143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 95.0, 78, 233, 81.0, 191.30000000000015, 233.0, 233.0, 0.054396359070366225, 0.014661518655684646, 0.03203223097600667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 99.33333333333333, 79, 252, 80.0, 252.0, 252.0, 252.0, 0.0836796742071351, 0.06218772663245098, 0.04698809830967058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 580.8235294117649, 80, 1092, 765.0, 1038.3999999999999, 1092.0, 1092.0, 0.07457121551081282, 39.47845899405623, 0.04007003388603764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 129.89999999999998, 78, 775, 80.0, 236.8, 748.0999999999997, 775.0, 0.12708741072109397, 5.750215105371349, 0.07416741860051343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 419.4117647058823, 78, 707, 616.0, 645.4, 707.0, 707.0, 0.07457186973610332, 12.906279609418867, 0.040143209518441185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 118.95000000000002, 78, 707, 80.0, 221.40000000000032, 683.4999999999997, 707.0, 0.12708741072109397, 1.90093724979666, 0.07429152740004574], "isController": false}, {"data": ["deleteBooks", 17, 4, 23.529411764705884, 543.4705882352941, 83, 1503, 419.0, 1386.1999999999998, 1503.0, 1503.0, 0.08419759690152843, 0.017475064200667637, 0.05663797447822254], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 191.08333333333334, 160, 318, 165.5, 316.5, 318.0, 318.0, 0.05437614699685071, 0.08427240750390828, 0.12229322903686249], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89d88ebe-2f33-46dc-83f5-d59fb9579dc8", 3, 0, 0.0, 723.6666666666667, 178, 1650, 343.0, 1650.0, 1650.0, 1650.0, 0.05004337092146527, 0.032173065615199836, 0.032091614816174015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 658.2, 114, 1590, 606.0, 1351.4000000000008, 1579.8, 1590.0, 0.11358731456870896, 0.06977189537472456, 0.051358326802062745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 90.8235294117647, 79, 233, 81.0, 123.3999999999999, 233.0, 233.0, 0.07465177144262353, 0.05547851373812159, 0.03747168996241064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 109.23529411764706, 79, 243, 81.0, 239.0, 243.0, 243.0, 0.07465242708214401, 0.08593091302113981, 0.03888719030221059], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c72568da-b00a-40ae-9897-b0691b7d2cce", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/092bf3b9-dec9-44ea-962f-d0100a830dd8", 1, 0, 0.0, 2061.0, 2061, 2061, 2061.0, 2061.0, 2061.0, 2061.0, 0.485201358563804, 0.154942230713246, 0.289509795002426], "isController": false}, {"data": ["login", 25, 0, 0.0, 2598.7999999999993, 1275, 4526, 2517.0, 3785.600000000001, 4364.0, 4526.0, 0.11403704835626999, 49.26644154090281, 0.24013262366177524], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 94.44999999999999, 80, 275, 84.0, 98.30000000000001, 266.1999999999999, 275.0, 0.11866619200189867, 0.0960686261421621, 0.042182122938174915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f05f6a9-b289-448f-bb68-e5ca41fb3407", 3, 0, 0.0, 316.6666666666667, 196, 555, 199.0, 555.0, 555.0, 555.0, 0.07392986520121245, 0.03345133874664235, 0.047409451317183764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a0dacfe-caff-4411-9743-9f0cc541dc68", 3, 0, 0.0, 356.0, 178, 527, 363.0, 527.0, 527.0, 527.0, 0.023882688235387774, 0.023952657048577387, 0.01531539577594854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0290f42-6de1-48e8-bd59-bebcbceb9025", 3, 0, 0.0, 359.3333333333333, 314, 384, 380.0, 384.0, 384.0, 384.0, 0.02543623136796052, 0.025510751577046346, 0.016311645766563226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 673.5882352941177, 161, 1175, 845.0, 1121.3999999999999, 1175.0, 1175.0, 0.07454407528074614, 52.50676463503002, 0.15643207801475972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 323.17647058823536, 159, 1015, 313.0, 964.5999999999999, 1015.0, 1015.0, 0.09271985513886162, 13.176813397541832, 0.20573815742467874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 9, 50.0, 487.1666666666667, 79, 1113, 431.0, 997.8000000000002, 1113.0, 1113.0, 0.14086491055078182, 84.28054897696859, 0.20535157044810695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72b8d2ec-8820-4c05-8802-b6f43d1c511d", 3, 0, 0.0, 358.0, 171, 715, 188.0, 715.0, 715.0, 715.0, 0.05227846998344515, 0.03361001895094537, 0.03352493029537336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c66b8e8-4330-4a38-b614-72bda24c79ba", 1, 0, 0.0, 1037.0, 1037, 1037, 1037.0, 1037.0, 1037.0, 1037.0, 0.9643201542912248, 0.17421799662487947, 0.664853543876567], "isController": false}, {"data": ["register", 26, 10, 38.46153846153846, 1066.3461538461536, 88, 2375, 995.0, 1738.7000000000003, 2259.8499999999995, 2375.0, 0.1061553788113864, 0.032982169979258874, 0.04789432129966847], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2c66b8e8-4330-4a38-b614-72bda24c79ba", 3, 0, 0.0, 853.0, 175, 1971, 413.0, 1971.0, 1971.0, 1971.0, 0.04508701794463314, 0.02898660821635757, 0.028913224398088314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 101.71428571428571, 81, 246, 84.0, 214.80000000000007, 245.2, 246.0, 0.0924491089666831, 0.0717744547153448, 0.03286276920300064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 220.1, 160, 855, 162.0, 320.6, 828.2999999999996, 855.0, 0.12702122524673873, 7.785092441681379, 0.28404873407471387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 233.84615384615387, 161, 399, 178.0, 373.0, 399.0, 399.0, 0.07752908831755914, 0.12015494449215465, 0.17436473671419797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 96.2, 79, 239, 80.0, 223.30000000000007, 239.0, 239.0, 0.058532245413998575, 0.04349906128911417, 0.029380443498823502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da2292a3-f99e-4518-af75-18227174ddbc", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 1.6376201923076923, 3.059895833333333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 149.60000000000002, 77, 319, 79.0, 311.0, 319.0, 319.0, 0.05853258801837924, 0.01566204015335538, 0.033381866604231904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 79.1, 78, 81, 79.0, 80.9, 81.0, 81.0, 0.058532245413998575, 0.0157762692717418, 0.034410558339089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 142.0, 79, 240, 80.0, 239.9, 240.0, 240.0, 0.05853258801837924, 0.015776361614328778, 0.03446792048347918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 85.25, 83, 88, 85.0, 88.0, 88.0, 88.0, 0.047726432091252935, 0.014075568839412486, 0.029502765150159285], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 920.7833333333333, 620, 1573, 870.5, 1257.8, 1320.0499999999997, 1573.0, 0.26145727570233956, 312.79379899600406, 0.5162759877637995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, 38.46153846153846, 1066.3461538461536, 88, 2375, 995.0, 1738.7000000000003, 2259.8499999999995, 2375.0, 0.1030323204463677, 0.032011844754069776, 0.04648528520138855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1473c30d-ac7c-472e-87a7-0560001ca24f", 3, 0, 0.0, 601.3333333333333, 182, 1364, 258.0, 1364.0, 1364.0, 1364.0, 0.06364022061943148, 0.02879554253288078, 0.0408109487696224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 101.42857142857143, 78, 236, 79.0, 236.0, 236.0, 236.0, 0.047475973766133356, 0.01279625855415313, 0.027957043145486728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 102.57142857142857, 78, 234, 80.0, 234.0, 234.0, 234.0, 0.047475651772876486, 0.012796171766908115, 0.027910490593038715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c7f32d9-f47a-478c-b5df-d4698c19ac8c", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 21, 0, 0.0, 141.8095238095238, 78, 888, 80.0, 243.8, 823.5999999999991, 888.0, 0.09107586619654172, 3.9257704923409533, 0.053169941603021985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 21, 0, 0.0, 113.3809523809524, 77, 462, 80.0, 236.6, 439.49999999999966, 462.0, 0.09107547120714031, 1.298579344625246, 0.053258651898706724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 21, 0, 0.0, 87.61904761904763, 78, 236, 80.0, 81.0, 220.49999999999977, 236.0, 0.09107507622116498, 0.0676837236370181, 0.04571541911882695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 81.42857142857142, 79, 90, 80.0, 90.0, 90.0, 90.0, 0.047475651772876486, 0.012703445884539215, 0.02707595765171862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ff4d861-9f73-46da-9632-1cbf7bf15a7a", 3, 0, 0.0, 426.0, 271, 576, 431.0, 576.0, 576.0, 576.0, 0.03702423853482747, 0.030094245970528705, 0.023742757133336623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 21, 0, 0.0, 118.42857142857143, 78, 243, 81.0, 240.4, 242.8, 243.0, 0.09107626118936922, 0.03088393306328499, 0.05157769292987995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 80.28571428571429, 79, 82, 80.0, 82.0, 82.0, 82.0, 0.04747532978398725, 0.035281958950795216, 0.023830390145477977], "isController": false}, {"data": ["deleteAccount", 17, 4, 23.529411764705884, 696.3529411764705, 79, 1971, 527.0, 1714.1999999999998, 1971.0, 1971.0, 0.0835384940466538, 0.016800796625536244, 0.05684245530690569], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 109.28571428571429, 81, 255, 84.0, 255.0, 255.0, 255.0, 0.04750819516366573, 0.03739414580265096, 0.016887678749584304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1361.5199999999998, 826, 2736, 1225.0, 2052.4, 2539.1999999999994, 2736.0, 0.11360641285479282, 0.05880019415335957, 0.05225451216270256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 206.57142857142858, 159, 317, 162.0, 317.0, 317.0, 317.0, 0.04744958481613286, 0.07353758896797152, 0.10671522835112693], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6e356a1-c930-4726-8d2a-401317201c95", 3, 0, 0.0, 315.6666666666667, 203, 496, 248.0, 496.0, 496.0, 496.0, 0.03387495624484819, 0.027909347088447507, 0.021723197852327774], "isController": false}, {"data": ["addBook", 57, 19, 33.333333333333336, 950.4385964912277, 408, 3498, 724.0, 1588.8000000000009, 2795.399999999999, 3498.0, 0.25687246507435785, 76.54492275518251, 0.9322145039995493], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b2ba63b-c047-4fee-a515-a3e50b60b35b", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 147.48333333333335, 78, 416, 81.0, 320.8, 341.49999999999994, 416.0, 0.2620751107267343, 0.19476480396781717, 0.12668669903294283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89d88ebe-2f33-46dc-83f5-d59fb9579dc8", 1, 0, 0.0, 1357.0, 1357, 1357, 1357.0, 1357.0, 1357.0, 1357.0, 0.7369196757553427, 0.13313490235814296, 0.5080715733235077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8882d839-5e3e-4f6b-840e-ae9df07fd611", 3, 0, 0.0, 706.6666666666667, 220, 1630, 270.0, 1630.0, 1630.0, 1630.0, 0.0391977526621807, 0.032677553570261975, 0.025136579669432287], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 501.9999999999998, 384, 714, 469.0, 632.5, 707.85, 714.0, 0.2619755576804684, 77.02951236524632, 0.1317552853568762], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 115.93333333333338, 78, 244, 82.0, 238.0, 239.95, 244.0, 0.2624132396226498, 0.464348427926017, 0.12761893880085898], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 771.7, 539, 1156, 779.5, 943.7, 1067.5499999999997, 1156.0, 0.2618955124203947, 235.65404243907656, 0.13145927088289341], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 86.76923076923077, 81, 104, 83.0, 100.8, 104.0, 104.0, 0.07944073721004132, 0.05934781637273594, 0.02823869955513187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 19, 10.919540229885058, 179.90804597701145, 80, 2581, 86.0, 265.0, 439.0, 2482.75, 0.7061630993254925, 1.639482145792242, 0.33383581505020254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 82.9, 81, 85, 83.0, 84.9, 85.0, 85.0, 0.060977840652706804, 0.04722209730234033, 0.021675716794516874], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 94.17647058823529, 80, 250, 84.0, 124.39999999999989, 250.0, 250.0, 0.09235215506470083, 0.07494593833863905, 0.03282830512065538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 248.0, 159, 479, 162.0, 471.1, 479.0, 479.0, 0.058504507772323855, 0.0906705603854277, 0.13157800917935727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 0, 0.0, 253.57142857142856, 159, 970, 164.0, 444.2000000000001, 920.3999999999993, 970.0, 0.09104269902584312, 5.320985125357126, 0.20364791972851934], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f05f6a9-b289-448f-bb68-e5ca41fb3407", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 0.8101527466367713, 3.0917180493273544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c72568da-b00a-40ae-9897-b0691b7d2cce", 3, 0, 0.0, 293.6666666666667, 187, 385, 309.0, 385.0, 385.0, 385.0, 0.041627351945384916, 0.026762376332075264, 0.026694623480601656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 95.91666666666667, 81, 236, 83.0, 191.00000000000017, 236.0, 236.0, 0.052979196835375976, 0.04392513487620528, 0.018832448875075056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72b8d2ec-8820-4c05-8802-b6f43d1c511d", 1, 0, 0.0, 1296.0, 1296, 1296, 1296.0, 1296.0, 1296.0, 1296.0, 0.7716049382716049, 0.13940128279320987, 0.5319854359567902], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 83.88235294117646, 82, 93, 83.0, 88.19999999999999, 93.0, 93.0, 0.07582143605799894, 0.05886527506455972, 0.026952151098741807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 82.84615384615385, 79, 94, 81.0, 92.0, 94.0, 94.0, 0.07767686424474188, 0.05772665399438336, 0.03899014474784895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 118.61538461538461, 78, 239, 82.0, 238.6, 239.0, 239.0, 0.07767779251664098, 0.020784878075741822, 0.0443006160446468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 130.61538461538458, 79, 240, 82.0, 239.6, 240.0, 240.0, 0.07760313755454605, 0.02091647066899874, 0.04562215703890305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 110.76923076923076, 78, 318, 80.0, 286.79999999999995, 318.0, 318.0, 0.07756655807348536, 0.0209066113557441, 0.04567640089678874], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 21.27659574468085, 0.7230657989877078], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 10.638297872340425, 0.3615328994938539], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 8.51063829787234, 0.28922631959508316], "isController": false}, {"data": ["401/Unauthorized", 28, 59.57446808510638, 2.0245842371655822], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1383, 47, "401/Unauthorized", 28, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 9, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
