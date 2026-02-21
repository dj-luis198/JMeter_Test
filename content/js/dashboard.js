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

    var data = {"OkPercent": 64.54545454545455, "KoPercent": 35.45454545454545};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.44233289646133683, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b26036ca-bcdd-4a05-a0eb-20ebde5fc34b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=acdffe80-aa3f-49ab-b2fb-ff88273b1f26"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1858f079-5d2c-4df7-8018-3cadeae3596f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2adc6d12-50a1-41a9-a346-6693b723e852"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dcaf2b37-b4a5-4b07-9aed-1c7bed107d5f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2adc6d12-50a1-41a9-a346-6693b723e852"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.47058823529411764, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=315dd16c-09dd-461d-a652-d053cc84b154"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/acdffe80-aa3f-49ab-b2fb-ff88273b1f26"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ec88da4-c754-4e7f-a594-b1e990c68213"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3bb41fd-4ee9-43c4-ae63-d26afe59a573"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b26036ca-bcdd-4a05-a0eb-20ebde5fc34b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d286f5e-da4b-471a-bac7-05a6e8ef0ef4"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dcaf2b37-b4a5-4b07-9aed-1c7bed107d5f"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8682432432432432, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e130a93a-4c61-4cec-93be-0bf39fc0da6b"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae543917-d033-4f11-8d84-9f28f8c543cb"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/a1815ef5-713c-4725-a30d-fbb4fcf55f72"], "isController": false}, {"data": [0.05, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ae543917-d033-4f11-8d84-9f28f8c543cb"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6d286f5e-da4b-471a-bac7-05a6e8ef0ef4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9ec88da4-c754-4e7f-a594-b1e990c68213"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a1ac9bed-dfd2-4455-ab2d-7cb791138746"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e3bb41fd-4ee9-43c4-ae63-d26afe59a573"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/315dd16c-09dd-461d-a652-d053cc84b154"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a1ac9bed-dfd2-4455-ab2d-7cb791138746"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f3d7217-22a9-4d19-8b2d-5f60a234324e"], "isController": false}, {"data": [0.55, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN="], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e130a93a-4c61-4cec-93be-0bf39fc0da6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1858f079-5d2c-4df7-8018-3cadeae3596f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6f3d7217-22a9-4d19-8b2d-5f60a234324e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/3c811145-7330-4d10-b08d-98b0bbbde7cd"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 550, 195, 35.45454545454545, 1014.1436363636365, 0, 35857, 112.0, 1212.8000000000002, 3191.1499999998496, 24530.410000000018, 2.1665399569055506, 2.257359988586274, 1.0319454470162805], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 50, 50, 100.0, 2566.46, 403, 24344, 647.5, 11105.599999999999, 12295.399999999998, 24344.0, 0.2331926404402677, 1.4941590709022223, 0.3881108918452534], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 2958.75, 102, 23497, 105.0, 19721.800000000014, 23497.0, 23497.0, 0.05617188597107148, 0.04361000912793147, 0.019967350091279316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 13, 100.0, 131.92307692307693, 100, 304, 102.0, 299.2, 304.0, 304.0, 0.08749495221429533, 0.04349114323933234, 0.04391836468569121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b26036ca-bcdd-4a05-a0eb-20ebde5fc34b", 3, 0, 0.0, 330.0, 187, 413, 390.0, 413.0, 413.0, 413.0, 0.05196424859696529, 0.03340800487597866, 0.03332342764844454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=acdffe80-aa3f-49ab-b2fb-ff88273b1f26", 1, 0, 0.0, 1211.0, 1211, 1211, 1211.0, 1211.0, 1211.0, 1211.0, 0.8257638315441783, 0.1491858484723369, 0.5693254541701073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 17, 100.0, 131.7058823529412, 1, 313, 101.0, 305.8, 313.0, 313.0, 0.08585728499063144, 0.05036125557441049, 0.04056125412241229], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1858f079-5d2c-4df7-8018-3cadeae3596f", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2adc6d12-50a1-41a9-a346-6693b723e852", 3, 0, 0.0, 301.6666666666667, 197, 383, 325.0, 383.0, 383.0, 383.0, 0.05215214519157221, 0.03352880428169112, 0.03344392123287671], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dcaf2b37-b4a5-4b07-9aed-1c7bed107d5f", 3, 0, 0.0, 4247.666666666667, 175, 12196, 372.0, 12196.0, 12196.0, 12196.0, 0.021834378957481186, 0.021898346864583182, 0.014001864110103495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2adc6d12-50a1-41a9-a346-6693b723e852", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 163.75, 102, 295, 129.0, 295.0, 295.0, 295.0, 0.05286250462546915, 0.015590308981339535, 0.03267770061320505], "isController": false}, {"data": ["https://demoqa.com/books", 50, 50, 100.0, 226.18000000000004, 100, 486, 126.0, 405.8, 443.04999999999995, 486.0, 0.2559508574353724, 0.1272255726900435, 0.12372624456104428], "isController": false}, {"data": ["deleteBook", 17, 5, 29.41176470588235, 1070.8823529411766, 1, 8847, 513.0, 2882.9999999999945, 8847.0, 8847.0, 0.08036533134153376, 0.02536807764945588, 0.050505326566887596], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 5, 29.41176470588235, 1070.8823529411766, 1, 8847, 513.0, 2882.9999999999945, 8847.0, 8847.0, 0.07994544898774954, 0.025235537809494696, 0.05024145289096851], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, 34.61538461538461, 5556.307692307693, 270, 32897, 1146.0, 26196.100000000002, 31033.59999999999, 32897.0, 0.10241825250826239, 0.03195954183588657, 0.0462082350183762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=315dd16c-09dd-461d-a652-d053cc84b154", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acdffe80-aa3f-49ab-b2fb-ff88273b1f26", 3, 0, 0.0, 890.0, 301, 1839, 530.0, 1839.0, 1839.0, 1839.0, 0.01830239212265043, 0.025231325077937686, 0.011736885573444449], "isController": false}, {"data": ["deleteAccount", 17, 4, 23.529411764705884, 3690.823529411765, 98, 35857, 390.0, 19632.999999999985, 35857.0, 35857.0, 0.08270453561403253, 0.021098968443354692, 0.05464067463792441], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 1, 14.285714285714286, 2766.857142857143, 0, 10822, 305.0, 10822.0, 10822.0, 10822.0, 0.03964096610697398, 0.03817544489905711, 0.012078106860718633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1495.1500000000003, 821, 6341, 1171.5, 2178.7000000000003, 6133.849999999997, 6341.0, 0.09501323059236, 0.04917676974018632, 0.043702374618165576], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 1041.8235294117646, 99, 12196, 268.0, 3899.9999999999927, 12196.0, 12196.0, 0.08041817450743868, 0.13838042379195345, 0.050381468932566995], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 7, 100.0, 129.71428571428572, 100, 299, 101.0, 299.0, 299.0, 299.0, 0.04300018428650409, 0.021374115040850176, 0.02158407687818662], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ec88da4-c754-4e7f-a594-b1e990c68213", 1, 0, 0.0, 1002.0, 1002, 1002, 1002.0, 1002.0, 1002.0, 1002.0, 0.998003992015968, 0.18030345558882235, 0.6880769710578842], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3bb41fd-4ee9-43c4-ae63-d26afe59a573", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["addBook", 49, 49, 100.0, 2269.469387755102, 413, 39575, 686.0, 2522.0, 13966.0, 39575.0, 0.22673323677890733, 0.7823326945857029, 0.43528750728785404], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b26036ca-bcdd-4a05-a0eb-20ebde5fc34b", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d286f5e-da4b-471a-bac7-05a6e8ef0ef4", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.4896045054200542, 1.8684366531165313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 1130.8235294117649, 100, 17143, 107.0, 3669.399999999988, 17143.0, 17143.0, 0.0776880049720323, 0.058038402151957734, 0.027615658017402112], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dcaf2b37-b4a5-4b07-9aed-1c7bed107d5f", 1, 0, 0.0, 893.0, 893, 893, 893.0, 893.0, 893.0, 893.0, 1.1198208286674132, 0.20231138017917133, 0.7720639697648376], "isController": false}, {"data": ["deleteBooks", 17, 4, 23.529411764705884, 527.4705882352941, 102, 1211, 450.0, 1164.6, 1211.0, 1211.0, 0.08043301349382086, 0.01669373148857851, 0.05410561741800564], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 148, 9, 6.081081081081081, 713.0202702702701, 99, 28140, 110.5, 613.8999999999985, 1894.5999999999988, 19937.889999999847, 0.6183000091909461, 1.3871237913383687, 0.2917170710857014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 1245.875, 101, 7439, 105.5, 7439.0, 7439.0, 7439.0, 0.04032278388499942, 0.031226530879691933, 0.014333489584120888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 10, 100.0, 161.79999999999998, 100, 300, 103.0, 299.9, 300.0, 300.0, 0.05859260561317162, 0.02912464478232847, 0.029410741489424037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 103.92857142857143, 100, 115, 103.0, 113.0, 115.0, 115.0, 0.14819362555704924, 0.12026260042764446, 0.05267820283473235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e130a93a-4c61-4cec-93be-0bf39fc0da6b", 1, 0, 0.0, 1153.0, 1153, 1153, 1153.0, 1153.0, 1153.0, 1153.0, 0.8673026886383347, 0.15669042714657416, 0.5979645490026019], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 1, 5.0, 560.4499999999999, 0, 1641, 400.0, 1585.3000000000002, 1638.75, 1641.0, 0.09528346831824679, 0.0652189286565031, 0.04092815775369223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae543917-d033-4f11-8d84-9f28f8c543cb", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1815ef5-713c-4725-a30d-fbb4fcf55f72", 1, 0, 0.0, 18347.0, 18347, 18347, 18347.0, 18347.0, 18347.0, 18347.0, 0.05450482367689541, 0.01740534896713359, 0.032521921158772546], "isController": false}, {"data": ["login", 20, 7, 35.0, 3308.05, 1310, 24688, 1964.0, 3450.7000000000007, 23627.899999999983, 24688.0, 0.08681384507201208, 0.14331066768528244, 0.12566812749047218], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ae543917-d033-4f11-8d84-9f28f8c543cb", 3, 0, 0.0, 849.0, 300, 1826, 421.0, 1826.0, 1826.0, 1826.0, 0.025388013472572482, 0.03000777243454124, 0.016280724785471285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 8, 100.0, 150.875, 100, 302, 101.5, 302.0, 302.0, 302.0, 0.041662760782843276, 0.02070932152194065, 0.02091275297107563], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d286f5e-da4b-471a-bac7-05a6e8ef0ef4", 3, 0, 0.0, 589.0, 316, 1065, 386.0, 1065.0, 1065.0, 1065.0, 0.047246326598107, 0.03037483562215538, 0.030297937304124604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ec88da4-c754-4e7f-a594-b1e990c68213", 3, 0, 0.0, 5361.666666666667, 200, 15577, 308.0, 15577.0, 15577.0, 15577.0, 0.02174023320023479, 0.025696219645199397, 0.013941490691556818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 149.6923076923077, 101, 306, 104.0, 304.8, 306.0, 306.0, 0.08752440584393725, 0.0708571605904531, 0.03111219113983707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 12, 100.0, 102.0, 99, 112, 101.0, 109.30000000000001, 112.0, 112.0, 0.062356450255141804, 0.030995540214714044, 0.031300015069475474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a1ac9bed-dfd2-4455-ab2d-7cb791138746", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3bb41fd-4ee9-43c4-ae63-d26afe59a573", 3, 0, 0.0, 1620.3333333333333, 202, 4405, 254.0, 4405.0, 4405.0, 4405.0, 0.07002147325179722, 0.03291373938007656, 0.0449030931985809], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/315dd16c-09dd-461d-a652-d053cc84b154", 3, 0, 0.0, 651.0, 192, 1493, 268.0, 1493.0, 1493.0, 1493.0, 0.029302311952413045, 0.023817666974340942, 0.018790870620525292], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1ac9bed-dfd2-4455-ab2d-7cb791138746", 3, 0, 0.0, 566.3333333333334, 368, 962, 369.0, 962.0, 962.0, 962.0, 0.02813546287525674, 0.02821789098914909, 0.018042598263104094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f3d7217-22a9-4d19-8b2d-5f60a234324e", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 2, 20.0, 2014.9, 1, 11698, 106.0, 11216.7, 11698.0, 11698.0, 0.0570226208737006, 0.06538111246856627, 0.016215807810958608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 17, 100.0, 126.94117647058823, 99, 303, 102.0, 298.2, 303.0, 303.0, 0.09606907931915279, 0.047753087278758564, 0.04822217458012162], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=", 1, 1, 100.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 3.2421875, 3.427734375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e130a93a-4c61-4cec-93be-0bf39fc0da6b", 3, 0, 0.0, 12126.333333333334, 176, 35857, 346.0, 35857.0, 35857.0, 35857.0, 0.01707446172759404, 0.020481572742898448, 0.0109494432302605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 106.70588235294117, 99, 147, 103.0, 118.99999999999997, 147.0, 147.0, 0.09429357472488463, 0.07320643740847976, 0.03351841914048633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1858f079-5d2c-4df7-8018-3cadeae3596f", 3, 0, 0.0, 649.0, 249, 1265, 433.0, 1265.0, 1265.0, 1265.0, 0.08634335875665564, 0.03906812131241905, 0.05536992732767305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f3d7217-22a9-4d19-8b2d-5f60a234324e", 3, 0, 0.0, 434.0, 191, 894, 217.0, 894.0, 894.0, 894.0, 0.04893804443574435, 0.03146244718769371, 0.03138279542266158], "isController": false}, {"data": ["https://demoqa.com/books?book=", 1, 1, 100.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 1.6964857081911264, 1.6698218856655291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 14, 100.0, 128.64285714285714, 98, 299, 100.0, 298.0, 299.0, 299.0, 0.13896195420211022, 0.06907386200085362, 0.06975238716785612], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 13, 100.0, 100.6153846153846, 98, 103, 101.0, 102.6, 103.0, 103.0, 0.1129629307797918, 0.05615051930362698, 0.06461934479327784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c811145-7330-4d10-b08d-98b0bbbde7cd", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2018.5546875, 0.0], "isController": false}, {"data": ["register", 26, 9, 34.61538461538461, 5556.307692307693, 270, 32897, 1146.0, 26196.100000000002, 31033.59999999999, 32897.0, 0.1006959640283033, 0.0314221029577503, 0.04543118689558216], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 1, 0.5128205128205128, 0.18181818181818182], "isController": false}, {"data": ["406/Not Acceptable", 9, 4.615384615384615, 1.6363636363636365], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 6, 3.076923076923077, 1.0909090909090908], "isController": false}, {"data": ["401/Unauthorized", 15, 7.6923076923076925, 2.727272727272727], "isController": false}, {"data": ["404/Not Found", 161, 82.56410256410257, 29.272727272727273], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 3, 1.5384615384615385, 0.5454545454545454], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 550, 195, "404/Not Found", 161, "401/Unauthorized", 15, "406/Not Acceptable", 9, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 6, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 3], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 17, "404/Not Found", 16, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 50, 50, "404/Not Found", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 5, "401/Unauthorized", 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 148, 9, "401/Unauthorized", 7, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=", 1, 1, "404/Not Found", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c811145-7330-4d10-b08d-98b0bbbde7cd", 1, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
