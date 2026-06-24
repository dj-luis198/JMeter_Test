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

    var data = {"OkPercent": 96.91856199559794, "KoPercent": 3.081438004402054};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7639149468417761, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.16666666666666666, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2a34cffd-2fbb-4a25-9f6d-81cc250cb907"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b0047c5-3641-4786-af0d-25bb5b91fc01"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dfcb3803-dbea-4b9a-9464-0d1364f112be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f9bcd72-c6ae-4c00-81da-d79a64d0e1c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e1c8f750-6cf8-485b-ba47-db668cec98fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/49f842fc-363e-4e5c-b590-771722d9aec9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6534e15c-7a98-4eac-8188-541f400a092d"], "isController": false}, {"data": [0.7708333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7c0d466-9718-41bc-a01c-a789c11a8567"], "isController": false}, {"data": [0.020833333333333332, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd0ec75b-18a3-40c7-adad-4aed8a29bb17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1853d0bc-8942-4bda-b18d-d4e28b7e2e4e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/901f87cf-e8a5-4ee0-8f0d-bad73e8fc41a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a34cffd-2fbb-4a25-9f6d-81cc250cb907"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6778caf3-7712-44cd-a40c-0a1998f379c0"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1736c0cb-8bea-402c-91f8-6b496e8460c7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4ce35c8-7360-4361-aac3-b17752077581"], "isController": false}, {"data": [0.9047619047619048, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.23529411764705882, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.28, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7b0047c5-3641-4786-af0d-25bb5b91fc01"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.43859649122807015, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.28, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6778caf3-7712-44cd-a40c-0a1998f379c0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7f9bcd72-c6ae-4c00-81da-d79a64d0e1c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e1c8f750-6cf8-485b-ba47-db668cec98fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49f842fc-363e-4e5c-b590-771722d9aec9"], "isController": false}, {"data": [0.26666666666666666, 500, 1500, "addBook"], "isController": true}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/04834d61-f173-4b1f-ab31-135fb9f79ad4"], "isController": false}, {"data": [0.5789473684210527, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6534e15c-7a98-4eac-8188-541f400a092d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8983050847457628, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b7c0d466-9718-41bc-a01c-a789c11a8567"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a3c86d91-edfb-4606-bf83-be7604f06069"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dfcb3803-dbea-4b9a-9464-0d1364f112be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1736c0cb-8bea-402c-91f8-6b496e8460c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=901f87cf-e8a5-4ee0-8f0d-bad73e8fc41a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fd0ec75b-18a3-40c7-adad-4aed8a29bb17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e4ce35c8-7360-4361-aac3-b17752077581"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1363, 42, 3.081438004402054, 361.52531181217876, 95, 2720, 117.0, 1006.0, 1217.8, 1563.8799999999992, 5.343358828302945, 763.2161448124237, 3.9001436848496374], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1622.964912280702, 1200, 2106, 1637.0, 1975.4, 2046.8, 2106.0, 0.2579477316438511, 310.3982792878154, 1.2683269812761624], "isController": true}, {"data": ["deleteBook", 18, 5, 27.77777777777778, 464.16666666666663, 104, 970, 455.0, 891.7000000000002, 970.0, 970.0, 0.09556879360326208, 0.020299035750692872, 0.06368660437439606], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, 27.77777777777778, 464.16666666666663, 104, 970, 455.0, 891.7000000000002, 970.0, 970.0, 0.09674766596255865, 0.02054943100278956, 0.06447219949099979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 158.42857142857142, 97, 305, 103.0, 302.8, 304.8, 305.0, 0.1042804647929288, 0.042819777907438676, 0.05863836403813686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 122.71428571428571, 98, 306, 103.0, 267.0000000000001, 306.0, 306.0, 0.10438257705670956, 0.07757338001968357, 0.05239516074916867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 213.5714285714286, 97, 776, 103.0, 543.4000000000002, 758.6999999999998, 776.0, 0.10438465247366772, 2.9485557637725606, 0.06061435804681403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 205.7142857142857, 98, 1181, 102.0, 709.4000000000003, 1143.9999999999995, 1181.0, 0.10438413361169104, 8.970695940824138, 0.06051211912217914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a34cffd-2fbb-4a25-9f6d-81cc250cb907", 3, 0, 0.0, 588.0, 203, 819, 742.0, 819.0, 819.0, 819.0, 0.08500510030601836, 0.039458747733197325, 0.05451173424572141], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b0047c5-3641-4786-af0d-25bb5b91fc01", 1, 0, 0.0, 647.0, 647, 647, 647.0, 647.0, 647.0, 647.0, 1.5455950540958268, 0.27923348145285937, 1.0656153400309119], "isController": false}, {"data": ["goToProfile", 19, 6, 31.57894736842105, 248.94736842105266, 102, 667, 207.0, 568.0, 667.0, 667.0, 0.09700806698662309, 0.11945015731900337, 0.06268428341672623], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dfcb3803-dbea-4b9a-9464-0d1364f112be", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 104.29411764705883, 98, 130, 103.0, 113.99999999999999, 130.0, 130.0, 0.08948027749413115, 0.06649852653616582, 0.0449149049140463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f9bcd72-c6ae-4c00-81da-d79a64d0e1c0", 1, 0, 0.0, 1075.0, 1075, 1075, 1075.0, 1075.0, 1075.0, 1075.0, 0.930232558139535, 0.16805959302325582, 0.6413517441860466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 113.82352941176471, 97, 303, 102.0, 146.19999999999987, 303.0, 303.0, 0.08949488036640257, 0.03185376141717775, 0.05059792121818325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 713.125, 586, 846, 739.0, 846.0, 846.0, 846.0, 0.061899382553659024, 18.200473723712108, 0.035301991612633664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1049.75, 870, 1181, 1089.5, 1181.0, 1181.0, 1181.0, 0.06170649306573284, 55.52361092899126, 0.03513172407941626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 204.75, 97, 342, 198.0, 342.0, 342.0, 342.0, 0.06217455506334033, 0.11001981813942645, 0.034426731172767545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 101.75, 98, 104, 102.0, 104.0, 104.0, 104.0, 0.06620653127431021, 0.04920231474584968, 0.033232575268550245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1c8f750-6cf8-485b-ba47-db668cec98fa", 3, 0, 0.0, 514.6666666666667, 207, 1118, 219.0, 1118.0, 1118.0, 1118.0, 0.04658963846440552, 0.029528003284569514, 0.02987681893713505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 133.25, 97, 297, 102.0, 295.8, 297.0, 297.0, 0.06613537912106081, 0.0176963807413776, 0.03771783340497999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 151.08333333333331, 97, 306, 101.0, 304.8, 306.0, 306.0, 0.06613392119041059, 0.017825158445852852, 0.038879512262331224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 134.5, 98, 305, 102.0, 301.40000000000003, 305.0, 305.0, 0.06620689655172414, 0.017844827586206896, 0.03898706896551724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 101.0, 97, 104, 101.0, 104.0, 104.0, 104.0, 0.06217455506334033, 0.04620589492500195, 0.034912469884199895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 164.52941176470588, 98, 965, 102.0, 436.19999999999953, 965.0, 965.0, 0.08949252474205097, 4.7594980933486, 0.05215941843019583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 717.8823529411767, 99, 1359, 910.0, 1322.2, 1359.0, 1359.0, 0.08758778098932975, 46.36950861644795, 0.04706434417360929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 163.94117647058823, 97, 787, 101.0, 399.79999999999967, 787.0, 787.0, 0.08949582265086627, 1.5706290667954705, 0.052248738832763895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 523.9411764705883, 97, 911, 779.0, 895.8, 911.0, 911.0, 0.08767993728305663, 15.174915027825486, 0.0471994882973072], "isController": false}, {"data": ["deleteBooks", 17, 4, 23.529411764705884, 488.11764705882365, 103, 1095, 425.0, 1079.0, 1095.0, 1095.0, 0.09261226513257173, 0.01922151389728755, 0.06229834700726189], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/49f842fc-363e-4e5c-b590-771722d9aec9", 3, 0, 0.0, 331.6666666666667, 227, 432, 336.0, 432.0, 432.0, 432.0, 0.05392095188453727, 0.03466597655337276, 0.03457821458741485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 271.0, 201, 408, 206.0, 407.4, 408.0, 408.0, 0.06609640160173613, 0.10243651302925316, 0.1486523563367171], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6534e15c-7a98-4eac-8188-541f400a092d", 3, 0, 0.0, 459.33333333333337, 236, 858, 284.0, 858.0, 858.0, 858.0, 0.026298718375791154, 0.02637576540228273, 0.01686473802093378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 581.2083333333334, 123, 1475, 454.0, 1357.0, 1470.0, 1475.0, 0.10643062718681678, 0.06537584423877711, 0.04812244178466423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 127.99999999999999, 100, 308, 105.0, 297.59999999999997, 308.0, 308.0, 0.08767631965754662, 0.06515788990175095, 0.04400940264060445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 183.3529411764706, 97, 321, 104.0, 310.59999999999997, 321.0, 321.0, 0.08759409924926703, 0.10082781254347502, 0.0456286357991931], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7c0d466-9718-41bc-a01c-a789c11a8567", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["login", 24, 0, 0.0, 2755.5833333333335, 1373, 5125, 2572.0, 4005.0, 4849.5, 5125.0, 0.10398883853133097, 41.608770971082436, 0.21437542787074187], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd0ec75b-18a3-40c7-adad-4aed8a29bb17", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 112.70588235294116, 99, 152, 108.0, 142.39999999999998, 152.0, 152.0, 0.08896052245991544, 0.07201979796803701, 0.03162268571817307], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1853d0bc-8942-4bda-b18d-d4e28b7e2e4e", 1, 0, 0.0, 673.0, 673, 673, 673.0, 673.0, 673.0, 673.0, 1.4858841010401187, 0.47449619242199104, 0.8865968610698365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/901f87cf-e8a5-4ee0-8f0d-bad73e8fc41a", 3, 0, 0.0, 539.3333333333333, 195, 1153, 270.0, 1153.0, 1153.0, 1153.0, 0.0717308657915501, 0.032456348779379765, 0.045999285680128156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a34cffd-2fbb-4a25-9f6d-81cc250cb907", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 0.8174844457013575, 3.1196973981900453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6778caf3-7712-44cd-a40c-0a1998f379c0", 3, 0, 0.0, 919.3333333333334, 568, 1286, 904.0, 1286.0, 1286.0, 1286.0, 0.05117445371270662, 0.032900242865428246, 0.03281695111133855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 847.2352941176471, 206, 1469, 1015.0, 1427.3999999999999, 1469.0, 1469.0, 0.08753997229617347, 61.6607115213546, 0.18370420082442057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1736c0cb-8bea-402c-91f8-6b496e8460c7", 3, 0, 0.0, 272.0, 191, 430, 195.0, 430.0, 430.0, 430.0, 0.039397481187702726, 0.02532878429222425, 0.025264660787686972], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4ce35c8-7360-4361-aac3-b17752077581", 1, 0, 0.0, 1095.0, 1095, 1095, 1095.0, 1095.0, 1095.0, 1095.0, 0.91324200913242, 0.1649900114155251, 0.6296375570776256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 395.7619047619047, 202, 1285, 390.0, 850.4000000000002, 1247.4999999999995, 1285.0, 0.10422560376403324, 12.021389086896857, 0.2318661020492739], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 9, 52.94117647058823, 596.8235294117646, 102, 1278, 112.0, 1230.0, 1278.0, 1278.0, 0.13102321423066252, 73.78294426985387, 0.18459761903844377], "isController": false}, {"data": ["register", 25, 9, 36.0, 945.3600000000001, 127, 1742, 852.0, 1501.0000000000002, 1687.6999999999998, 1742.0, 0.10086054214558614, 0.03142436266223418, 0.04550543991334063], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 122.66666666666666, 102, 313, 106.0, 209.80000000000007, 313.0, 313.0, 0.07176346761075496, 0.05571480151420916, 0.025509670127260548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 281.88235294117646, 202, 1063, 208.0, 535.7999999999995, 1063.0, 1063.0, 0.08943038107863562, 6.423965928339961, 0.19978504651694967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 440.6470588235294, 201, 1408, 213.0, 1386.4, 1408.0, 1408.0, 0.08931808270854459, 18.97084675841035, 0.19684560220090264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b0047c5-3641-4786-af0d-25bb5b91fc01", 3, 0, 0.0, 895.3333333333334, 236, 1283, 1167.0, 1283.0, 1283.0, 1283.0, 0.04482495853691335, 0.03736872357195153, 0.02874517197842425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 121.08333333333334, 98, 303, 104.5, 245.4000000000002, 303.0, 303.0, 0.062182287375441105, 0.04621164130147527, 0.031212593467750713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 150.16666666666669, 96, 297, 102.5, 297.0, 297.0, 297.0, 0.0621204826761504, 0.016622082278579305, 0.03542808777624202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 117.91666666666667, 97, 303, 101.0, 243.60000000000022, 303.0, 303.0, 0.06218357628111122, 0.016760417044518257, 0.03655714152463765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 134.75, 96, 305, 101.5, 304.1, 305.0, 305.0, 0.062118874820114085, 0.016742977978858875, 0.03657976710598516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 107.25, 103, 112, 107.0, 112.0, 112.0, 112.0, 0.07014590347923681, 0.020687561377665545, 0.04336167666245791], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1114.8771929824563, 789, 1660, 1024.0, 1545.0, 1607.1999999999998, 1660.0, 0.2693010927954871, 322.17773119144476, 0.5317644625317137], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 945.3600000000001, 127, 1742, 852.0, 1501.0000000000002, 1687.6999999999998, 1742.0, 0.09992485650790606, 0.031132838105744482, 0.04508328486977793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6778caf3-7712-44cd-a40c-0a1998f379c0", 1, 0, 0.0, 914.0, 914, 914, 914.0, 914.0, 914.0, 914.0, 1.0940919037199124, 0.19766308807439825, 0.7543250820568927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f9bcd72-c6ae-4c00-81da-d79a64d0e1c0", 3, 0, 0.0, 545.0, 189, 1062, 384.0, 1062.0, 1062.0, 1062.0, 0.04865785418863028, 0.03128231185629714, 0.031203116130078663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 136.66666666666669, 98, 311, 102.5, 311.0, 311.0, 311.0, 0.036950135791749036, 0.009959216287619857, 0.02175872254143034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 101.33333333333334, 97, 104, 102.0, 104.0, 104.0, 104.0, 0.03695036334523956, 0.009959277620396601, 0.021722772201009977], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e1c8f750-6cf8-485b-ba47-db668cec98fa", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 127.33333333333334, 95, 305, 100.0, 302.0, 305.0, 305.0, 0.07002049266418638, 0.018872710913393986, 0.04116439119515645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 128.33333333333334, 98, 306, 101.0, 304.8, 306.0, 306.0, 0.0700208195236717, 0.01887279901223964, 0.04123296305934965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 103.93333333333334, 97, 116, 103.0, 114.2, 116.0, 116.0, 0.07001689741124192, 0.052034041923784274, 0.03514520045837729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 134.66666666666669, 98, 305, 101.5, 305.0, 305.0, 305.0, 0.03694945314809341, 0.009886865393142182, 0.021072734998522025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 127.86666666666665, 100, 297, 102.0, 296.4, 297.0, 297.0, 0.0700208195236717, 0.018736039599107468, 0.039933748634594014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 139.66666666666666, 104, 305, 107.5, 305.0, 305.0, 305.0, 0.036948087936449284, 0.027458491132458896, 0.018546208202475524], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 708.0000000000001, 102, 1394, 604.0, 1318.4, 1394.0, 1394.0, 0.08979330703137715, 0.017685730089737187, 0.06110263550371239], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 107.83333333333333, 104, 112, 107.5, 112.0, 112.0, 112.0, 0.03561528370541412, 0.028033123697816187, 0.012660120379658923], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1481.4166666666663, 912, 2720, 1353.5, 2358.0, 2669.0, 2720.0, 0.10513312481930245, 0.05441460561936552, 0.048357130654190866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 278.0, 208, 616, 210.5, 616.0, 616.0, 616.0, 0.03692489476404992, 0.05722637499076878, 0.08304495375156931], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49f842fc-363e-4e5c-b590-771722d9aec9", 1, 0, 0.0, 711.0, 711, 711, 711.0, 711.0, 711.0, 711.0, 1.4064697609001406, 0.25409854078762306, 0.9696949718706048], "isController": false}, {"data": ["addBook", 60, 15, 25.0, 1068.2166666666667, 511, 4028, 844.5, 1869.7, 1900.5, 4028.0, 0.2876139070911209, 92.93654510684857, 1.0431106657423075], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 190.82456140350874, 100, 521, 105.0, 409.2, 414.0, 521.0, 0.2703394894852167, 0.20090659326000967, 0.13068168681170142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04834d61-f173-4b1f-ab31-135fb9f79ad4", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 1.5501744538834952, 2.896503337378641], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 655.0877192982454, 471, 945, 607.0, 888.6, 908.2, 945.0, 0.2701818750622129, 79.44244215086103, 0.1358824859932028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6534e15c-7a98-4eac-8188-541f400a092d", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 162.98245614035088, 98, 407, 105.0, 311.2, 323.5999999999995, 407.0, 0.2707889936150806, 0.4791695863579355, 0.1316923035354591], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 921.3684210526318, 688, 1275, 906.0, 1203.0, 1239.5, 1275.0, 0.2698761410552631, 242.8350261131799, 0.1354651723656301], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 117.58823529411765, 102, 304, 105.0, 153.59999999999985, 304.0, 304.0, 0.090628481866307, 0.06770584826926254, 0.03221559316341381], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 15, 8.474576271186441, 179.24293785310738, 97, 2440, 111.0, 310.0000000000001, 450.19999999999993, 1385.4399999999985, 0.7351872235259911, 1.6440306276089802, 0.3517701800066458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7c0d466-9718-41bc-a01c-a789c11a8567", 3, 0, 0.0, 330.0, 258, 455, 277.0, 455.0, 455.0, 455.0, 0.023530149965489112, 0.02781184066558951, 0.015089321429691913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 144.66666666666669, 103, 334, 105.0, 328.0, 334.0, 334.0, 0.06414779652318943, 0.0496769557059465, 0.02280253704535249], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3c86d91-edfb-4606-bf83-be7604f06069", 1, 0, 0.0, 343.0, 343, 343, 343.0, 343.0, 343.0, 343.0, 2.9154518950437316, 0.9310085641399416, 1.7395909256559765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dfcb3803-dbea-4b9a-9464-0d1364f112be", 3, 0, 0.0, 719.6666666666666, 466, 1026, 667.0, 1026.0, 1026.0, 1026.0, 0.03207012667700038, 0.02673554505852798, 0.02056580389117537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 136.28571428571428, 100, 324, 105.0, 318.8, 323.8, 324.0, 0.100418410041841, 0.08149189330543934, 0.03569560669456067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 274.9166666666667, 201, 606, 211.0, 546.0000000000002, 606.0, 606.0, 0.06208480784751971, 0.09621932622462284, 0.13963018796175578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 260.5333333333333, 199, 415, 208.0, 408.4, 415.0, 415.0, 0.06998227115797331, 0.10845885188252309, 0.15739176804376223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1736c0cb-8bea-402c-91f8-6b496e8460c7", 1, 0, 0.0, 825.0, 825, 825, 825.0, 825.0, 825.0, 825.0, 1.2121212121212122, 0.21898674242424243, 0.8357007575757576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=901f87cf-e8a5-4ee0-8f0d-bad73e8fc41a", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 0.8481880868544601, 3.236869131455399], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd0ec75b-18a3-40c7-adad-4aed8a29bb17", 3, 0, 0.0, 692.6666666666667, 201, 1394, 483.0, 1394.0, 1394.0, 1394.0, 0.03822386443269414, 0.031865663024781804, 0.02451204848060139], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 110.91666666666666, 102, 154, 105.5, 142.60000000000005, 154.0, 154.0, 0.06744452687664396, 0.05591836261549875, 0.023974421663182033], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 110.17647058823529, 102, 123, 108.0, 119.8, 123.0, 123.0, 0.08592541673827118, 0.06670967412785701, 0.030543800481182333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4ce35c8-7360-4361-aac3-b17752077581", 3, 0, 0.0, 300.0, 216, 451, 233.0, 451.0, 451.0, 451.0, 0.04541601065762383, 0.02825195194229139, 0.02912419954281216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 115.3529411764706, 98, 306, 102.0, 160.39999999999986, 306.0, 306.0, 0.08945767599482198, 0.06648172991412063, 0.044903560020838375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 148.58823529411762, 98, 302, 103.0, 301.2, 302.0, 302.0, 0.08936738405896144, 0.04759963149096338, 0.04964284259249524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 299.52941176470586, 95, 1308, 103.0, 1120.7999999999997, 1308.0, 1308.0, 0.08936691426558796, 14.210278829700831, 0.05118268240050045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 247.05882352941177, 99, 807, 103.0, 791.8, 807.0, 807.0, 0.08946050055781254, 4.661802717888943, 0.051323645396994126], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 21.428571428571427, 0.6603081438004402], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 6, 14.285714285714286, 0.4402054292002935], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 7.142857142857143, 0.22010271460014674], "isController": false}, {"data": ["401/Unauthorized", 24, 57.142857142857146, 1.760821716801174], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1363, 42, "401/Unauthorized", 24, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 9, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
