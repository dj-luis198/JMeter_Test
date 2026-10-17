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

    var data = {"OkPercent": 98.62909367859864, "KoPercent": 1.3709063214013708};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7296587926509186, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f5ccd505-9bb3-41b9-9f8d-96edcf14875e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f1a37c9-f29b-4851-8ba6-6bdd4aca8ff1"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1621b352-cb4f-40f0-a631-a2571eeafb31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/352744b7-f8c8-437f-8f95-484c3b3eb33b"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd39ea3e-77c1-45a4-ab2d-630dcd2da12a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e5407fcd-d15b-4183-b706-f2d0a15e00d5"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bfb746fd-5e47-4cef-ab27-aac3f5807357"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bbcb5985-ed05-42fb-858f-50b08864c663"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3caa2620-9a69-4aef-90a2-b064d339b27e"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4e0bec91-e59c-49f0-858e-3d077d465e14"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/64ad5bbb-8b8a-4e46-91ff-8366fb6dfe96"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=20436e9e-cd44-4d3e-aceb-077793292fcb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7f1a37c9-f29b-4851-8ba6-6bdd4aca8ff1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cf87779a-0dd7-4da2-8ad1-c34833e16ca5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5ccd505-9bb3-41b9-9f8d-96edcf14875e"], "isController": false}, {"data": [0.3611111111111111, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f5b13f5f-690e-4615-9c19-76c3e330aa3e"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "register"], "isController": true}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e0bec91-e59c-49f0-858e-3d077d465e14"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bd39ea3e-77c1-45a4-ab2d-630dcd2da12a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.30701754385964913, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=352744b7-f8c8-437f-8f95-484c3b3eb33b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/20436e9e-cd44-4d3e-aceb-077793292fcb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3c2f8994-45e7-4dbf-8493-5e7fb77578f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.09523809523809523, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bbcb5985-ed05-42fb-858f-50b08864c663"], "isController": false}, {"data": [0.3050847457627119, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0aa3943b-b934-4a0c-9da4-5f8f7bae7823"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3684210526315789, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9228571428571428, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bfb746fd-5e47-4cef-ab27-aac3f5807357"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf87779a-0dd7-4da2-8ad1-c34833e16ca5"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1621b352-cb4f-40f0-a631-a2571eeafb31"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5b13f5f-690e-4615-9c19-76c3e330aa3e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64ad5bbb-8b8a-4e46-91ff-8366fb6dfe96"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1313, 18, 1.3709063214013708, 479.742574257426, 133, 2582, 161.0, 1349.6000000000001, 1613.0, 2097.0399999999986, 5.1851939610063935, 721.4902685981317, 3.7954856812329942], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2315.0, 1655, 3186, 2258.0, 2810.2000000000003, 3039.6999999999994, 3186.0, 0.2436261834035005, 293.16412928349325, 1.1979080404654543], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f5ccd505-9bb3-41b9-9f8d-96edcf14875e", 3, 0, 0.0, 409.6666666666667, 285, 617, 327.0, 617.0, 617.0, 617.0, 0.0429080195088462, 0.027585722177725015, 0.027515884906389003], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f1a37c9-f29b-4851-8ba6-6bdd4aca8ff1", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 0.6452287946428571, 2.462332589285714], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 669.7692307692308, 155, 1404, 596.0, 1256.8, 1404.0, 1404.0, 0.07893043193160981, 0.014953616987043266, 0.053357493761460095], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 669.7692307692308, 155, 1404, 596.0, 1256.8, 1404.0, 1404.0, 0.0801583435586605, 0.015186248682011851, 0.05418757013855061], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1621b352-cb4f-40f0-a631-a2571eeafb31", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 156.06250000000003, 134, 411, 139.0, 224.1000000000002, 411.0, 411.0, 0.0727431439586819, 0.026293023591510874, 0.041104493821379214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 143.06250000000003, 135, 157, 142.0, 155.6, 157.0, 157.0, 0.07274082897267217, 0.054058369968948757, 0.03651248641792334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 275.37499999999994, 134, 1081, 139.5, 724.7000000000004, 1081.0, 1081.0, 0.07265164896539511, 1.3534828377507049, 0.04239195337580427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/352744b7-f8c8-437f-8f95-484c3b3eb33b", 3, 0, 0.0, 394.3333333333333, 278, 518, 387.0, 518.0, 518.0, 518.0, 0.018433179723502304, 0.025411626344086023, 0.011820756528417818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 267.12500000000006, 135, 1908, 139.0, 868.5000000000011, 1908.0, 1908.0, 0.07274182109149102, 4.109206962131063, 0.04237353152448672], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd39ea3e-77c1-45a4-ab2d-630dcd2da12a", 1, 0, 0.0, 1084.0, 1084, 1084, 1084.0, 1084.0, 1084.0, 1084.0, 0.9225092250922509, 0.16666426429889297, 0.6360268680811808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5407fcd-d15b-4183-b706-f2d0a15e00d5", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.8188100961538461, 1.5299479166666665], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 288.69230769230774, 135, 535, 278.0, 451.79999999999995, 535.0, 535.0, 0.07914715892140688, 0.16947195146452684, 0.05116145601853261], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bfb746fd-5e47-4cef-ab27-aac3f5807357", 3, 0, 0.0, 459.3333333333333, 270, 599, 509.0, 599.0, 599.0, 599.0, 0.025487014366180432, 0.025561683353581353, 0.016344211686645654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 155.58823529411762, 135, 411, 139.0, 198.99999999999983, 411.0, 411.0, 0.08925477513046948, 0.06633094128348366, 0.04480171329791144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 205.2941176470588, 135, 434, 141.0, 423.59999999999997, 434.0, 434.0, 0.08925290071927339, 0.031767634010605346, 0.05046111264241088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1044.0, 820, 1228, 1073.0, 1228.0, 1228.0, 1228.0, 0.045720974039630935, 13.443484446867657, 0.02607524300697702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1303.2, 1210, 1516, 1230.0, 1516.0, 1516.0, 1516.0, 0.045558501671997015, 40.993619887766634, 0.025938092260521736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 248.4, 138, 412, 142.0, 412.0, 412.0, 412.0, 0.046007471613390014, 0.08141165875338155, 0.025474840239054823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 179.71428571428575, 134, 417, 140.5, 415.5, 417.0, 417.0, 0.07592602635717771, 0.056425494197082274, 0.038111306198817724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 235.85714285714286, 134, 427, 141.0, 419.5, 427.0, 427.0, 0.07581870664117714, 0.028421437603912244, 0.04278552851054151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 259.07142857142856, 133, 1555, 139.0, 982.0, 1555.0, 1555.0, 0.0759322033898305, 4.899284957627119, 0.04417372881355932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 248.71428571428572, 134, 827, 141.0, 628.0, 827.0, 827.0, 0.0758178854391751, 1.6113310337497901, 0.04418126499434074], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bbcb5985-ed05-42fb-858f-50b08864c663", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 141.0, 137, 144, 142.0, 144.0, 144.0, 144.0, 0.046005355023324715, 0.034189526535888776, 0.025833085096105185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 1001.2777777777777, 136, 1887, 1283.0, 1816.8000000000002, 1887.0, 1887.0, 0.11813581681072673, 59.0690492568929, 0.06381077431464818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 287.7058823529411, 134, 1571, 140.0, 646.1999999999991, 1571.0, 1571.0, 0.08925477513046948, 4.74685381019447, 0.05202084952169941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 733.6111111111112, 135, 1270, 840.0, 1246.6000000000001, 1270.0, 1270.0, 0.11813581681072673, 19.31184758674779, 0.06392614132325242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 210.94117647058823, 133, 822, 140.0, 486.7999999999997, 822.0, 822.0, 0.08925758689488605, 1.5664480894938568, 0.052109653929959046], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 537.3076923076924, 264, 1084, 511.0, 910.7999999999998, 1084.0, 1084.0, 0.08017960230917254, 0.015190276218729955, 0.054840390551759016], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3caa2620-9a69-4aef-90a2-b064d339b27e", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 502.2857142857143, 275, 1972, 287.5, 1399.5, 1972.0, 1972.0, 0.0757559360187009, 6.582623304622735, 0.16899238517564555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e0bec91-e59c-49f0-858e-3d077d465e14", 3, 0, 0.0, 524.3333333333334, 512, 535, 526.0, 535.0, 535.0, 535.0, 0.025131942699170646, 0.030146877879701765, 0.016116512733517635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 754.0476190476192, 144, 1699, 635.0, 1643.0, 1696.3999999999999, 1699.0, 0.09263180182087656, 0.056899807954425154, 0.04188332445611899], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64ad5bbb-8b8a-4e46-91ff-8366fb6dfe96", 3, 0, 0.0, 757.3333333333334, 247, 1532, 493.0, 1532.0, 1532.0, 1532.0, 0.04683475138552806, 0.030110232417453746, 0.030034003980953863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 202.8888888888889, 137, 426, 141.5, 418.8, 426.0, 426.0, 0.11813271554298391, 0.0877919887970808, 0.05929708573153684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 231.3888888888889, 135, 428, 142.0, 425.3, 428.0, 428.0, 0.11813581681072673, 0.1301852599316125, 0.061862353724887936], "isController": false}, {"data": ["login", 21, 0, 0.0, 3157.0476190476193, 2273, 4878, 3231.0, 4114.0, 4810.999999999999, 4878.0, 0.0897965466813762, 25.701551389013606, 0.17093664613105164], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 146.64705882352948, 138, 159, 147.0, 154.2, 159.0, 159.0, 0.09029201499909709, 0.07309773479907371, 0.03209598970671029], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=20436e9e-cd44-4d3e-aceb-077793292fcb", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 0.6843335700757576, 2.611564867424242], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f1a37c9-f29b-4851-8ba6-6bdd4aca8ff1", 3, 0, 0.0, 566.3333333333334, 233, 1075, 391.0, 1075.0, 1075.0, 1075.0, 0.07826155010043565, 0.035411313359246605, 0.050187257063104895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf87779a-0dd7-4da2-8ad1-c34833e16ca5", 3, 0, 0.0, 577.0, 283, 1100, 348.0, 1100.0, 1100.0, 1100.0, 0.03591652998431645, 0.029942133232367975, 0.0230324101787446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5ccd505-9bb3-41b9-9f8d-96edcf14875e", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.3016094532554257, 1.1510068864774625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1222.6111111111109, 288, 2027, 1423.5, 1957.7, 2027.0, 2027.0, 0.11802659532614683, 78.52620846119547, 0.24866779529598446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5b13f5f-690e-4615-9c19-76c3e330aa3e", 3, 0, 0.0, 356.3333333333333, 252, 541, 276.0, 541.0, 541.0, 541.0, 0.02914800384753651, 0.029233398390058587, 0.018691916529832982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 507.75, 274, 2048, 299.5, 1116.3000000000009, 2048.0, 2048.0, 0.07260318727992159, 5.534154021138872, 0.16212525694721747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1071.1428571428573, 135, 1661, 1372.0, 1661.0, 1661.0, 1661.0, 0.0636983247340595, 54.43725658140191, 0.11465342992729291], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1444.4545454545457, 153, 2461, 1485.5, 2302.6, 2440.2999999999997, 2461.0, 0.08985826900298166, 0.02841576297839317, 0.04054152371032962], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 494.35294117647067, 277, 1712, 300.0, 998.3999999999994, 1712.0, 1712.0, 0.08918687798710463, 6.406474606659637, 0.19924106721280516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 163.94117647058823, 137, 407, 148.0, 219.79999999999984, 407.0, 407.0, 0.09741059712696039, 0.07562639132415382, 0.0346264231974742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e0bec91-e59c-49f0-858e-3d077d465e14", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 534.75, 273, 838, 564.0, 831.7, 838.0, 838.0, 0.188454788518392, 0.2920681146276251, 0.42383923628696957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 172.77777777777777, 135, 426, 144.0, 426.0, 426.0, 426.0, 0.04806639571461378, 0.03572121790900497, 0.024127077536436996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 170.22222222222223, 135, 404, 143.0, 404.0, 404.0, 404.0, 0.04806690913751943, 0.012861653421562815, 0.027413159117491547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 140.22222222222223, 137, 144, 141.0, 144.0, 144.0, 144.0, 0.048068706204067675, 0.012956018469065116, 0.028259141733250726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd39ea3e-77c1-45a4-ab2d-630dcd2da12a", 3, 0, 0.0, 398.6666666666667, 273, 542, 381.0, 542.0, 542.0, 542.0, 0.02358379321730107, 0.023652886361492383, 0.015123721561876012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 199.33333333333334, 133, 417, 141.0, 417.0, 417.0, 417.0, 0.0480010240218458, 0.012937776005888125, 0.028266228012864273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.7193216463414634, 1.5077172256097562], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1558.0350877192982, 1074, 2582, 1397.0, 2210.4, 2408.7999999999993, 2582.0, 0.24987177632530674, 298.933513969805, 0.4933991520798538], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1444.4545454545457, 153, 2461, 1485.5, 2302.6, 2440.2999999999997, 2461.0, 0.08986744551786116, 0.028418664855701475, 0.040545663895753765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 170.11111111111111, 134, 411, 140.0, 411.0, 411.0, 411.0, 0.04349128724545516, 0.011722261015376587, 0.025610592000985803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 171.44444444444446, 135, 420, 140.0, 420.0, 420.0, 420.0, 0.04343126278809405, 0.011706082548353473, 0.02553283222503185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 285.6470588235294, 134, 1261, 141.0, 596.9999999999994, 1261.0, 1261.0, 0.09693458626037771, 5.155290677244891, 0.056496915912097434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 276.05882352941177, 134, 1071, 142.0, 560.5999999999996, 1071.0, 1071.0, 0.09693513898788311, 1.701187188168211, 0.056591901282965075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=352744b7-f8c8-437f-8f95-484c3b3eb33b", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 201.66666666666666, 135, 417, 140.0, 417.0, 417.0, 417.0, 0.04343252034089703, 0.011621592356841588, 0.024770109256917836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 174.2941176470588, 136, 426, 141.0, 420.4, 426.0, 426.0, 0.09709514181602183, 0.07215762004100841, 0.048737209856870335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 171.0, 136, 404, 141.0, 404.0, 404.0, 404.0, 0.04348939583564874, 0.0323197560848913, 0.021829638144065872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 220.94117647058823, 135, 425, 139.0, 423.4, 425.0, 425.0, 0.09709347817395725, 0.03455831748425087, 0.054893957501613466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20436e9e-cd44-4d3e-aceb-077793292fcb", 3, 0, 0.0, 372.0, 261, 543, 312.0, 543.0, 543.0, 543.0, 0.07480364044383493, 0.035161607031542204, 0.047969782446079044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c2f8994-45e7-4dbf-8493-5e7fb77578f4", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.8023516017587939, 1.499195194723618], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 146.99999999999997, 140, 154, 148.0, 154.0, 154.0, 154.0, 0.04540249310134341, 0.03573672796844022, 0.016139167469618163], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 613.6153846153845, 138, 1100, 542.0, 1090.0, 1100.0, 1100.0, 0.08176512025762302, 0.01531867562518869, 0.05564843671379693], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1709.8571428571431, 1388, 2099, 1722.0, 2020.4, 2091.4, 2099.0, 0.09057306874495917, 0.046878639096512076, 0.04166007361218337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 376.6666666666667, 280, 822, 285.0, 822.0, 822.0, 822.0, 0.04340110335249412, 0.06726323341836735, 0.09761009865311909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbcb5985-ed05-42fb-858f-50b08864c663", 3, 0, 0.0, 562.0, 294, 829, 563.0, 829.0, 829.0, 829.0, 0.017992083483267363, 0.02480353956759026, 0.011537892077485906], "isController": false}, {"data": ["addBook", 59, 9, 15.254237288135593, 1418.3898305084745, 702, 3033, 1151.0, 2692.0, 2714.0, 3033.0, 0.2961119001851954, 85.18521717016147, 1.0783705705549338], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 239.98245614035093, 135, 583, 144.0, 559.4, 571.5, 583.0, 0.2513726268439505, 0.18681110256664682, 0.12151313504663624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0aa3943b-b934-4a0c-9da4-5f8f7bae7823", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.7478593384074942, 1.3973763173302107], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 894.0526315789474, 662, 1278, 827.0, 1203.0, 1235.6999999999998, 1278.0, 0.25079418157498745, 73.74181653360642, 0.12613183936632671], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 195.0, 135, 431, 143.0, 412.8, 424.5, 431.0, 0.2515789891821034, 0.44517688320114407, 0.12234993809832767], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1315.771929824562, 933, 2005, 1225.0, 1702.4, 1967.0, 2005.0, 0.25052962842500376, 225.42700004093084, 0.12575412989301946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 146.1875, 137, 183, 144.5, 158.50000000000003, 183.0, 183.0, 0.16660592492320508, 0.12446634039673037, 0.05922319987504556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 9, 5.142857142857143, 224.2571428571428, 136, 1017, 151.0, 404.20000000000005, 529.1999999999996, 850.560000000002, 0.7338633923778851, 1.5638293083547201, 0.3524264275739734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 146.44444444444446, 139, 160, 146.0, 160.0, 160.0, 160.0, 0.04903670124662192, 0.03797471102399529, 0.017431014896260134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bfb746fd-5e47-4cef-ab27-aac3f5807357", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 162.9375, 139, 418, 146.5, 234.6000000000002, 418.0, 418.0, 0.07381537851142063, 0.0599029097099517, 0.02623906033023155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 376.00000000000006, 278, 844, 286.0, 844.0, 844.0, 844.0, 0.04796367550974728, 0.0743343291347353, 0.10787143037006641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf87779a-0dd7-4da2-8ad1-c34833e16ca5", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 512.4705882352941, 275, 1408, 555.0, 963.9999999999995, 1408.0, 1408.0, 0.09685892213112418, 6.957573121364229, 0.21638020581096556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1621b352-cb4f-40f0-a631-a2571eeafb31", 3, 0, 0.0, 402.3333333333333, 290, 560, 357.0, 560.0, 560.0, 560.0, 0.021051154304961055, 0.024881751719177603, 0.013499600905199636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5b13f5f-690e-4615-9c19-76c3e330aa3e", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 0.29812551567656764, 1.1377114273927393], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64ad5bbb-8b8a-4e46-91ff-8366fb6dfe96", 1, 0, 0.0, 651.0, 651, 651, 651.0, 651.0, 651.0, 651.0, 1.5360983102918586, 0.2775177611367127, 1.0590677803379416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 170.6428571428571, 139, 405, 145.0, 296.0, 405.0, 405.0, 0.07111616826085411, 0.05896252622408705, 0.025279575436475483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 151.2222222222222, 137, 255, 142.0, 174.0000000000001, 255.0, 255.0, 0.11900275689720145, 0.09238983567702651, 0.04230176124080208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 174.125, 136, 407, 140.5, 407.0, 407.0, 407.0, 0.1893939393939394, 0.14075076941287878, 0.09506687973484848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 250.25, 135, 559, 140.0, 469.4000000000001, 559.0, 559.0, 0.1893939393939394, 0.050677675189393936, 0.10801373106060605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 279.43749999999994, 134, 435, 277.5, 434.3, 435.0, 435.0, 0.19000118750742193, 0.05121125757035982, 0.11169991687448047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 261.0625, 134, 430, 142.5, 425.1, 430.0, 430.0, 0.1893647994508421, 0.05103973110198478, 0.11151071686411893], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 27.77777777777778, 0.38080731150038083], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.555555555555555, 0.07616146230007616], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.07616146230007616], "isController": false}, {"data": ["401/Unauthorized", 11, 61.111111111111114, 0.8377760853008378], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1313, 18, "401/Unauthorized", 11, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
